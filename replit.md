# Travel Buddy Finder Application

## Overview

This is a full-stack web application designed to help travelers find and connect with like-minded travel companions. The platform allows users to create travel plans, discover other travelers' trips, and communicate through an integrated messaging system. Built with modern web technologies, it features a mobile-first design optimized for social interaction and travel planning.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui design system for accessible, customizable components
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful endpoints with JSON responses
- **Session Management**: Express sessions with PostgreSQL store for persistent authentication
- **Database Access**: Drizzle ORM for type-safe database queries and schema management
- **Authentication**: OpenID Connect (OIDC) integration with Replit Auth for secure user authentication

### Data Storage
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle Kit for database migrations and schema evolution
- **Session Storage**: PostgreSQL-backed sessions for authentication persistence
- **Data Models**: 
  - Users with profiles, interests, and location data
  - Travel plans with destinations, dates, and descriptions
  - Messages for user-to-user communication
  - Matches for connecting compatible travelers

### External Dependencies

- **Database Hosting**: Neon Database (PostgreSQL-compatible serverless database)
- **Authentication Provider**: Replit Auth with OpenID Connect protocol
- **UI Component Library**: Radix UI for accessible, unstyled components
- **Styling Framework**: Tailwind CSS for utility-first styling
- **Icon Library**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date formatting and manipulation
- **Form Management**: React Hook Form with Hookform Resolvers for validation
- **Build Tools**: Vite with React plugin and TypeScript support
- **Development Tools**: ESBuild for production builds and TypeScript compiler for type checking

### Key Features
- **User Authentication**: Secure login/logout with Replit Auth integration
- **Profile Management**: User profiles with interests, location, and bio information
- **Travel Planning**: Create, edit, and manage personal travel itineraries
- **Discovery System**: Search and browse other users' travel plans with filtering
- **Messaging**: Real-time communication between matched travelers
- **Mobile-First Design**: Responsive interface optimized for mobile devices
- **Type Safety**: End-to-end TypeScript for runtime error prevention