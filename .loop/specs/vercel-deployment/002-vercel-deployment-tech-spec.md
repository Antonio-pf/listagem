# Technical Specification: Vercel Deployment

## Architecture Overview
Deployment of the present-list-page application on Vercel platform, leveraging Next.js 16 native integration with automatic build and deployment pipeline.

## Technical Stack
- **Platform**: Vercel
- **Framework**: Next.js 16.0.3 (Turbopack)
- **Database**: Supabase (already configured)
- **Environment**: Production with environment variables

## Component Design

### Vercel Project Configuration
- **vercel.json**: Configuration file for build settings, redirects, and headers
- **Build Command**: `npm run build` (default Next.js build)
- **Output Directory**: `.next` (default Next.js output)
- **Install Command**: `npm install`

### Environment Variables Configuration
Required environment variables to be configured in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

## Data Model
No changes to existing data model. Uses existing Supabase integration.

## API Endpoints
No new API endpoints. Uses existing Supabase client-side integration.

## Technical Decisions

### 1. Deployment Strategy
- **Git Integration**: Connect GitHub/GitLab repository to Vercel
- **Auto-deploy**: Enable automatic deployments on push to main branch
- **Preview Deployments**: Enable preview deployments for pull requests

### 2. Build Configuration
- **Framework Preset**: Next.js (auto-detected)
- **Node Version**: 18.x or higher (Vercel default)
- **Build Output**: Static and Server-Side Rendering (SSR) hybrid

### 3. Environment Configuration
- **Production**: Main branch → production deployment
- **Preview**: Feature branches → preview deployments
- **Development**: Local environment remains unchanged

## Testing Strategy
1. Verify local build: `npm run build` succeeds
2. Test production build locally: `npm start`
3. Validate environment variables are properly set
4. Test deployment in Vercel preview environment
5. Verify production deployment functionality

## Performance Considerations
- Vercel Edge Network for global CDN
- Automatic image optimization via Next.js Image component
- Server-side rendering for dynamic content
- Static generation where applicable

## Security Considerations
- Environment variables stored securely in Vercel
- Supabase RLS (Row Level Security) policies remain active
- HTTPS enforced by default on Vercel domains
- `.env.local` file excluded from git (already in `.gitignore`)

## Changes

### Create vercel.json configuration file
**Description**: Optional configuration file to customize Vercel deployment settings
**Example**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```
**Technical patterns**: Standard Vercel configuration
**Use as reference the file**: package.json

### Verify .gitignore includes sensitive files
**Description**: Ensure `.env.local` and other sensitive files are not tracked by git
**Example**:
```
# local env files
.env*.local
.env.local

# vercel
.vercel
```
**Technical patterns**: Git ignore patterns
**Use as reference the file**: .gitignore

### Create deployment documentation
**Description**: Step-by-step guide for deploying to Vercel
**Example**: DEPLOYMENT.md file with instructions
**Technical patterns**: Markdown documentation
**Use as reference the file**: SUPABASE-SETUP.md