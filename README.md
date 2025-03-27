# SimCase AI - Healthcare Simulation Case Generator

SimCase AI is a powerful healthcare simulation case generator that combines multiple AI models with educational expertise to create realistic clinical scenarios for medical education.

## Features

- **AI-Powered Case Generation**: Generate realistic healthcare simulation cases using a combination of Claude, Perplexity, and ChatGPT models
- **Learning Objective Focus**: Start with educational goals and let AI create cases that meet your specific learning objectives
- **Multi-step Creation Process**: Intuitive workflow that guides faculty through the case creation process
- **EHR Compatibility**: Generate cases in EdEHR-compatible format for seamless integration
- **Faculty Guides & Assessment Materials**: Automatically create supporting materials for instructors

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm or yarn
- Supabase account (for authentication and database)
- API keys for AI providers (Claude, OpenAI, Perplexity)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/simcaseai.git
   cd simcaseai
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # AI API Keys
   ANTHROPIC_API_KEY=your_claude_api_key
   OPENAI_API_KEY=your_openai_api_key
   PERPLEXITY_API_KEY=your_perplexity_api_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/src/app` - Next.js App Router pages and layouts
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and API services
- `/src/types` - TypeScript type definitions
- `/src/utils` - Helper functions

## How It Works

1. **Define Learning Objectives**: Start by inputting the learning objectives for your simulation case
2. **AI Analysis & Refinement**: AI analyzes your objectives and suggests refinements for optimal educational outcomes
3. **Case Generation**: The system creates patient profiles, clinical data, and learning activities based on objectives
4. **Review & Customize**: Faculty can review and modify all case elements
5. **Export & Deploy**: Generate EdEHR-compatible files or integrate directly with your LMS

## AI Model Selection

SimCase AI intelligently routes tasks to different AI models based on:

- **Claude**: Complex medical reasoning, clinical accuracy, and detailed feedback
- **ChatGPT**: General task handling and creative content generation
- **Perplexity**: Research-oriented tasks and fact verification

## Deployment

The application is configured for deployment on Render with Docker support. For detailed deployment instructions, see the [deployment guide](DEPLOYMENT.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative