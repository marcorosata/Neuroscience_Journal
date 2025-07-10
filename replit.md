# Replit Project Guide - CNS Journal Website

## Overview

This is a full-stack web application for the CNS Journal - a student-run academic journal for the Cognitive Neuroscience Master's Programme at Radboud University. The application serves as a digital platform for publishing neuroscience research articles, managing editorial content, and facilitating academic communication.

## Recent Changes (January 2025)

- **Functional MRI Brain Visualization**: Created sophisticated brain visualization mimicking real fMRI scans
- **Anatomically Correct Regions**: 8 brain regions (frontal, parietal, temporal, occipital lobes + motor cortex, hippocampus, amygdala, cerebellum)
- **Dynamic Neural Activation**: Regions illuminate with colored lights that fade slowly, creating hypnotic cascades
- **Neural Connections**: Active regions show connecting pathways when both are activated
- **Complete Darkness Theme**: Brain emerges from shadow only when regions activate, matching fMRI aesthetic

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