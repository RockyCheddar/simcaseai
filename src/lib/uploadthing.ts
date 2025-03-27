import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Generate React components based on the configured file router
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();

// Re-export components from the client
export {
  UploadButton,
  UploadDropzone,
  Uploader
} from "uploadthing/react";

// Types for responses
export type UploadFileResponse = {
  url: string;
  name: string;
  size: number;
  key: string;
  serverData?: {
    uploadedBy?: string;
  };
};
 