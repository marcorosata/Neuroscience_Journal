# Replit Project Guide - CNS Journal Website

## Overview

This is a full-stack web application for the CNS Journal - a student-run academic journal for the Cognitive Neuroscience Master's Programme at Radboud University. The application serves as a digital platform for publishing neuroscience research articles, managing editorial content, and facilitating academic communication.

## Recent Changes (January 2025)

### Latest Updates
- **Simplified Welcome Page**: Made welcome2 the main welcome page, removed old welcome page
- **Default Route**: Changed default route from cover page to welcome page (/ now shows welcome instead of cover)
- **Removed Cover Page**: Completely removed the cover page component and route - welcome is now the only entry point
- **Minimalist Design**: Reduced content to show only "Welcome" and "CNS Student Journal" titles
- **Interactive Background**: Combined lightning and debris/dust effects with cursor interaction on welcome page
- **Fixed Lightning Visibility**: Resolved lightning sticking issue by properly clearing canvas between frames
- **Debris/Dust Particle System**: Converted smoke to realistic debris/dust with earthy colors and sharp edges
- **Reduced Particle Count**: Minimized particles from 50 to 12 for cleaner, more focused debris effect
- **Enhanced Lightning Timing**: Fixed lightning to appear for just brief moments (0.2-0.5 seconds) then disappear completely
- **Debris Physics**: Slower upward motion, reduced turbulence, and earth-tone coloring for realistic debris appearance
- **Minimalistic Home Page**: Removed all animations, background effects, and complex layouts from home page
- **Clean White Background**: Replaced animated backgrounds with simple white background for journal pages
- **Simplified Content**: Streamlined home page to focus on essential content without visual distractions
- **Basic Article Display**: Created simple article grid layout without fancy animations or effects

- **3D fMRI Brain Visualization**: Created interactive 3D brain model with realistic anatomical shape
- **Interactive Rotation**: Click and drag to manually rotate brain, auto-rotates when idle
- **Anatomically Correct Regions**: 12 brain regions positioned in 3D space (frontal, parietal, temporal, occipital lobes + motor cortex, hippocampus, amygdala, Broca's, Wernicke's areas)
- **Surface-Based Activation**: Regions now activate directly on brain surface as flattened glowing patches rather than floating spheres
- **Selective Activation**: Only 1-3 regions activate at a time, creating realistic fMRI-like patterns
- **Complete Darkness Theme**: Brain emerges from shadow only when regions activate, matching fMRI aesthetic
- **Depth-Sorted Rendering**: Proper 3D perspective with correct occlusion of regions
- **Toggle Views**: Brain demo page allows switching between 2D and 3D visualizations
- **Enhanced Brain Mesh**: High-resolution triangulated mesh with cortical folding patterns
- **Anatomical Accuracy**: Proper brain proportions with temporal lobes, frontal bulge, and occipital shape
- **Standard fMRI Colors**: Blue to red to yellow color scale matching real fMRI data
- **Surface Glowing**: GLB model integration with surface-based activation visualization
- **Ultrarealistic Lightning Background**: Implemented multi-layered atmospheric lightning effects with realistic electrical discharge physics
- **Natural Lightning Timing**: Lightning appears in brief 0.5-1.5 second bursts with 3-13 second dormant periods
- **Atmospheric Scattering**: 5-layer rendering system simulating real atmospheric light scattering
- **Realistic Electrical Colors**: Physics-based color palette for authentic electrical discharge appearance
- **Complex Fractal Branching**: Multiple-layer branch rendering for realistic lightning patterns
- **Interactive Smoke System**: Created realistic 3D smoke particles with mouse cursor interaction
- **Cursor-Responsive Physics**: Smoke particles react to mouse movement with realistic turbulence and dispersion
- **Velocity-Based Animation**: Particles have individual velocities affected by cursor proximity and natural forces
- **Realistic Smoke Behavior**: Upward drift, velocity damping, and natural turbulence for authentic smoke physics
- **Real-Time Interaction**: Particles are pushed away from cursor with distance-based force calculations

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based sessions
- **Email Service**: SendGrid for transactional emails

### Project Structure
```
├── client/          # Frontend React application
├── server/          # Backend Express.js application
├── shared/          # Shared TypeScript types and schemas
├── attached_assets/ # Static assets (PDFs, images)
├── migrations/      # Database migration files
```

## Key Components

### Database Schema
- **Articles**: Store research publications with metadata (title, abstract, authors, category, DOI, etc.)
- **Editors**: Editorial board member information
- **Issues**: Journal issue management with PDF storage
- **Requests**: Handle user requests for journal access
- **Users**: User authentication and profile management

### Frontend Features
- **Dynamic particle backgrounds**: Interactive visual effects using HTML5 Canvas
- **Responsive design**: Mobile-first approach with Tailwind CSS
- **Smooth animations**: Framer Motion for page transitions and scroll reveals
- **Search functionality**: Article search with category filtering
- **PDF viewing**: Journal issue downloads and viewing

### Backend Features
- **RESTful API**: Clean API endpoints for data management
- **File serving**: Static file serving for PDFs and images
- **Error handling**: Comprehensive error handling middleware
- **Development logging**: Request/response logging for debugging

## Data Flow

1. **Client requests** → Express.js routes → Database queries via Drizzle ORM
2. **Static assets** served directly from `attached_assets/` directory
3. **API responses** formatted as JSON with proper error handling
4. **Real-time updates** handled through React Query cache invalidation

## External Dependencies

### Production Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **Email**: SendGrid for contact forms and notifications
- **CDN**: Replit's development banner script

### Development Tools
- **TypeScript**: Type safety across the stack
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Fast JavaScript bundling for production
- **Vite**: Development server with hot reloading

## Deployment Strategy

### Development
- Run with `npm run dev` for development server
- Vite handles frontend with hot module replacement
- Express.js backend serves API routes
- Database migrations via `npm run db:push`

### Production
- Build frontend with `npm run build`
- Bundle backend with ESBuild
- Deploy to Replit with environment variables:
  - `DATABASE_URL`: PostgreSQL connection string
  - `SENDGRID_API_KEY`: Email service configuration
  - `NODE_ENV=production`

### Environment Configuration
- Database URL must be configured for Drizzle ORM
- SendGrid API key for email functionality
- Static assets served from `attached_assets/` directory
- CORS and security middleware configured for production

The application follows a modern full-stack architecture with clear separation of concerns, type safety, and scalable design patterns suitable for academic publishing workflows.