# MeetCheck - Event Attendance Management System

## Overview

MeetCheck is a comprehensive event attendance management system built as a full-stack web application. The system enables event organizers to create events, manage attendees, generate QR codes for check-ins, and analyze attendance data. It features a freemium subscription model with tiered access to advanced features.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server components:

- **Frontend**: React-based SPA with TypeScript, built using Vite
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **External Services**: Supabase for authentication and additional database services
- **Build System**: Vite for frontend bundling, esbuild for server bundling

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state, React Context for client state
- **Routing**: React Router for navigation
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database Layer**: Drizzle ORM with PostgreSQL
- **Connection**: Neon serverless PostgreSQL
- **Authentication**: Supabase Auth integration
- **Session Management**: Connect-pg-simple for PostgreSQL session storage

### Database Schema
The system uses a simple user-based schema with plans for expansion:
- Users table with username/password authentication
- Schema designed for extension with events, participants, and check-ins tables

### Authentication & Authorization
- JWT-based authentication with bcrypt password hashing
- Server-side session management with PostgreSQL
- Role-based access control for different subscription tiers
- Secure password handling with validation requirements

## Data Flow

1. **User Registration/Login**: Users authenticate via JWT tokens
2. **Event Creation**: Users create events with customizable participant fields
3. **QR Code Generation**: System generates secure QR codes for event check-ins
4. **Attendance Tracking**: Participants scan QR codes to check into events
5. **Analytics**: Event organizers view attendance data and analytics
6. **Subscription Management**: Users can upgrade to access premium features

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database queries
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI components

### Development Tools
- **TypeScript**: Type safety across the stack
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework
- **tsx**: TypeScript execution for development

### Subscription & Payment
- Tiered subscription model (Freemium, Professional, Enterprise)
- Usage-based pricing for events and attendees
- Integration points prepared for payment processing

## Deployment Strategy

### Development Environment
- **Server**: Runs on port 5000 via `npm run dev`
- **Database**: PostgreSQL 16 via Replit modules
- **Hot Reload**: Vite HMR for frontend, tsx for backend

### Production Build
- **Frontend**: Static files built to `dist/public`
- **Backend**: Bundled server code in `dist/index.js`
- **Database**: Migrations managed via Drizzle Kit
- **Deployment**: Configured for Replit autoscale deployment

### Environment Configuration
- Database URL required for PostgreSQL connection
- Supabase URL and keys for authentication
- QR code secret for secure token generation

## Changelog

- January 24, 2025: Migrated from Lovable to Replit
  - Replaced Supabase with PostgreSQL database
  - Implemented JWT authentication with bcryptjs
  - Created comprehensive API endpoints
  - Added proper client/server separation
  - Secured environment variables
- June 25, 2025: Complete Dashboard Layout Implementation
  - Created comprehensive dashboard-based application layout
  - Implemented AppLayout component with sidebar navigation
  - Added Dashboard page with stats, recent events, and quick actions
  - Enhanced Templates page with category filters and template cards
  - Improved Analytics page with attendance trends and session data
  - Created comprehensive Settings page with tabbed interface
  - Added ProtectedRoute component for authentication guards
  - Fixed login/signup redirects to use dashboard flow
  - Integrated all pages into cohesive navigation structure
- June 25, 2025: 7-Step Event Creation Flow Implementation
  - Created complete 7-step event creation wizard matching design specifications
  - Step 1: Event Title & Description with form validation
  - Step 2: Date & Time selection with proper input controls
  - Step 3: Location & Expected Capacity configuration
  - Step 4: Participant Information Fields with custom field support
  - Step 5: Event Flier upload with image preview and validation
  - Step 6: Location Verification settings for secure check-ins
  - Step 7: Review & Create with complete event summary
  - Enhanced Events page with proper tab filtering (All, Upcoming, Completed)
  - Fixed public check-in flow integration with QR code generation
  - All event creation flows properly connected to backend API
- June 25, 2025: Post-Supabase Migration Fixes & Production Readiness
  - Updated database connections to use neon-http for production stability
  - Fixed storage layer and schema imports with proper typing
  - Resolved EventManagement component syntax errors and interface mismatches
  - Fixed corrupted Events.tsx file causing runtime errors
  - Enhanced API client with proper public endpoints for check-ins
  - Verified all authentication, event management, and QR code functionality
  - Confirmed all 10 database tables properly configured and operational
  - Application fully tested and production-ready after Supabase migration
- June 25, 2025: Participant Field Configuration & Location Verification Enhancements
  - Added gender dropdown options (Male, Female) for participant fields
  - Enhanced participant information step to allow marking fields as required
  - Implemented location verification enforcement preventing check-in without location access
  - Added clear status indicators for location verification states (requesting, granted, denied)
  - Fixed home page routing for pricing and resources tabs to be publicly accessible
  - Replaced Lovable favicon with custom MeetCheck company favicon
  - Updated manifest.json with proper MeetCheck branding
- June 24, 2025: Initial setup
- June 24, 2025: Backend Feature Implementation
  - Fixed event creation validation issues
  - Added complete database schema for all phases
  - Implemented event templates, analytics, subscriptions, and notifications
  - Added comprehensive API endpoints for all backend phases
  - Updated storage layer with all missing operations
  - Event metrics auto-update on check-ins for real-time analytics

## User Preferences

Preferred communication style: Simple, everyday language.