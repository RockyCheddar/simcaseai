# Deployment Guide for SimCase AI

This guide provides step-by-step instructions for deploying the SimCase AI application to production environments.

## Option 1: Deploying to Render

[Render](https://render.com) is a unified cloud platform that makes it easy to deploy and scale web applications.

### Prerequisites

- A [Render account](https://dashboard.render.com/register)
- Your SimCase AI codebase pushed to a GitHub or GitLab repository

### Deployment Steps

1. **Log in to your Render dashboard** and click on "New Web Service".

2. **Connect your repository** by selecting your Git provider and finding the SimCase AI repository.

3. **Configure your web service**:
   - Name: `simcaseai` (or your preferred name)
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Choose according to your needs (starter plan is good for testing)

4. **Set environment variables** by scrolling down to the "Environment" section and adding:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ANTHROPIC_API_KEY=your_claude_api_key
   OPENAI_API_KEY=your_openai_api_key
   PERPLEXITY_API_KEY=your_perplexity_api_key
   NODE_ENV=production
   ```

5. **Deploy** by clicking the "Create Web Service" button at the bottom.

6. **Wait for the build to complete** - Render will automatically build and deploy your application.

## Option 2: Docker Deployment

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your deployment server
- [Docker Compose](https://docs.docker.com/compose/install/) (optional, for easier management)

### Deployment Steps

1. **Create a Dockerfile** in the root of your project (already included in this repository):

2. **Build the Docker image**:
   ```
   docker build -t simcaseai:latest .
   ```

3. **Create a `.env` file** with your environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ANTHROPIC_API_KEY=your_claude_api_key
   OPENAI_API_KEY=your_openai_api_key
   PERPLEXITY_API_KEY=your_perplexity_api_key
   NODE_ENV=production
   ```

4. **Run the container**:
   ```
   docker run -p 3000:3000 --env-file .env simcaseai:latest
   ```

5. **Access the application** at `http://your-server-ip:3000`

### Using Docker Compose (Optional)

1. **Create a `docker-compose.yml` file**:
   ```yaml
   version: '3'
   services:
     simcaseai:
       build: .
       ports:
         - "3000:3000"
       env_file:
         - .env
       restart: always
   ```

2. **Start the service**:
   ```
   docker-compose up -d
   ```

## Option 3: Vercel Deployment

### Prerequisites

- A [Vercel account](https://vercel.com/signup)
- Your SimCase AI codebase pushed to a GitHub, GitLab, or Bitbucket repository

### Deployment Steps

1. **Log in to Vercel** and click "New Project".

2. **Import your Git repository** by selecting it from the list.

3. **Configure your project**:
   - Framework Preset: Next.js
   - Root Directory: `./` (or where your package.json is located)

4. **Set environment variables** in the Environment Variables section:
   - Add the same environment variables as listed in the Render deployment section

5. **Deploy** by clicking "Deploy".

## Setting Up a Custom Domain

After deployment, you can set up a custom domain for your SimCase AI application:

### On Render:
1. Go to your service dashboard
2. Click on "Custom Domain"
3. Follow the instructions to add and verify your domain

### On Vercel:
1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain and follow the verification steps

## Continuous Deployment

Both Render and Vercel support continuous deployment from your Git repository. Any changes pushed to your main branch will automatically trigger a new build and deployment.

## SSL Certificates

Render and Vercel automatically provision and renew SSL certificates for your domains using Let's Encrypt.

## Monitoring and Logs

- **Render**: Access logs from your service dashboard under the "Logs" tab
- **Vercel**: View logs in the project dashboard under "Deployments" > select a deployment > "Logs"
- **Docker**: View logs using `docker logs [container_id]` or `docker-compose logs`

## Troubleshooting

If you encounter any issues during deployment, check:

1. **Build Logs**: Review build logs for any errors
2. **Environment Variables**: Ensure all required environment variables are set correctly
3. **API Limits**: Verify that your AI service API keys are valid and have sufficient quota
4. **Network Rules**: If using a firewall, ensure port 3000 is open (for Docker deployments)

For further assistance, please open an issue in the GitHub repository. 