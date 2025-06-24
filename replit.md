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
- Primary authentication through Supabase Auth
- Session-based authentication for Express server
- Role-based access control for different subscription tiers
- Secure password handling with validation requirements

## Data Flow

1. **User Registration/Login**: Users authenticate via Supabase Auth
2. **Event Creation**: Users create events with customizable participant fields
3. **QR Code Generation**: System generates secure QR codes for event check-ins
4. **Attendance Tracking**: Participants scan QR codes to check into events
5. **Analytics**: Event organizers view attendance data and analytics
6. **Subscription Management**: Users can upgrade to access premium features

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database queries
- **@supabase/supabase-js**: Authentication and additional services
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

- June 24, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.