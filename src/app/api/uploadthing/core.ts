import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique route key
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = { id: "user-id" }; // Replace with actual user auth

      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);
      
      // Return the file URL or other data you want to access on the client
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // File uploads route for PDFs and other documents
  documentUploader: f({
    pdf: { maxFileSize: "16MB" },
    image: { maxFileSize: "8MB" },
    text: { maxFileSize: "2MB" }
  })
    .middleware(async ({ req }) => {
      const user = { id: "user-id" }; // Replace with actual user auth
      
      if (!user) throw new Error("Unauthorized");
      
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Document upload complete:", file.name, "by user", metadata.userId);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 