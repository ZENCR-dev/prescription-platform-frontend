# DevEnv.md - Development Environment Configuration

## Overview

This document consolidates all development environment configuration, port assignments, CORS policies, commands, and local setup procedures for the prescription platform frontend.

## Port Allocation {#ports}

### Frontend Services
- **Primary Development Server**: `localhost:3000` (default Next.js)
- **Alternative Ports**: `localhost:3001-3009` (available for parallel development/testing)
- **Usage**: Frontend development servers, testing instances, and parallel development

### Backend Coordination
- **Backend API Server**: `localhost:4000` (managed by backend team)
- **Supabase Local**: `localhost:54321` (managed by Supabase CLI)

### Port Assignment Strategy
```bash
# Frontend port usage
3000    # Primary development server
3001    # Alternative when 3000 occupied
3002    # Parallel testing environment
3003-3009    # Reserved for additional development instances

# Backend coordination
4000    # Backend API server (backend team responsibility)
54321   # Supabase local stack (Supabase CLI managed)
```

## CORS Configuration {#cors}

### Development CORS Setup
**Frontend-Backend Communication Pattern**:
- Frontend: `http://localhost:3000-3009`
- Backend API: `http://localhost:4000`
- Supabase Local: `http://localhost:54321`

### Next.js CORS Solution
```javascript
// next.config.js - API Route Proxy (Recommended)
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*'
      }
    ]
  }
}
```

### Backend CORS Requirements
**Backend Team Responsibility**:
- Allow origins: `http://localhost:3000-3009`
- Allow credentials for authentication
- Support preflight OPTIONS requests

## Environment Variables {#env}

### Required Environment Variables
```bash
# API Integration
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Development Environment
NODE_ENV=development
```

### Environment Setup Commands
```bash
# Quick environment setup
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" >> .env.local
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:4000" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key" >> .env.local
```

## Development Commands {#commands}

### Frontend Development
```bash
# Start development server
npm run dev               # Default port 3000
npm run dev -- -p 3001    # Use port 3001 if 3000 occupied
npm run dev -- -p 3002    # Use port 3002 for parallel testing

# Build and deployment
npm run build             # Build production frontend
npm run start             # Start production server
npm run export            # Export static site

# Code quality
npm run lint              # Run ESLint for code quality
npm run lint:fix          # Fix ESLint issues automatically
npm run type-check        # TypeScript type checking
npm run format            # Run Prettier formatting

# Testing
npm run test              # Run frontend test suite
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report
npm run e2e               # Run end-to-end tests
```

### Database and Type Generation
```bash
# Supabase type generation
supabase gen types typescript  # Generate TypeScript types from schema
npm run db:types          # Update database types for frontend
npm run db:reset          # Reset local database to migrations
```

## Supabase Local Setup {#supabase-local}

### Supabase CLI Commands
```bash
# Core Supabase operations
supabase start             # Start local Supabase stack (port 54321)
supabase stop              # Stop local Supabase stack
supabase status            # Check Supabase services status
supabase db reset          # Reset local database to migrations
supabase db diff           # Show database schema differences
supabase db push           # Push local changes to remote database

# Database management
supabase db dump           # Dump database schema
supabase db seed           # Seed database with initial data
supabase migration new     # Create new database migration
supabase migration up      # Apply pending migrations
```

### Database Connection
```bash
# Connect to local database
supabase db connect        # Connect to local Postgres instance
psql 'postgresql://postgres:postgres@localhost:54322/postgres'
```

## Edge Functions Development {#edge-functions}

### Edge Functions Commands
```bash
# Edge Functions development
supabase functions serve   # Serve Edge Functions locally
supabase functions new     # Create new Edge Function
supabase functions deploy  # Deploy Edge Function to remote

# Local Edge Functions testing
supabase functions invoke function-name --data '{"key":"value"}'
curl -X POST 'http://localhost:54321/functions/v1/function-name' \
  -H 'Content-Type: application/json' \
  -d '{"key":"value"}'
```

### Edge Functions Environment
```bash
# Edge Functions environment variables
supabase secrets list      # List Edge Function secrets
supabase secrets set KEY=VALUE  # Set Edge Function secret
```

## Development Workflow {#workflow}

### Daily Development Startup
```bash
# 1. Start Supabase local stack
supabase start

# 2. Generate latest types
supabase gen types typescript > types/supabase.ts

# 3. Start frontend development server
npm run dev

# 4. Verify services are running
curl http://localhost:3000         # Frontend
curl http://localhost:54321        # Supabase
curl http://localhost:4000/health  # Backend (if available)
```

### Pre-Commit Workflow
```bash
# Quality checks before commit
npm run lint              # Check code style
npm run type-check        # Verify TypeScript types
npm run test              # Run test suite
npm run build             # Verify build success
```

## Troubleshooting {#troubleshooting}

### Common Port Issues
```bash
# Check what's running on ports
lsof -i :3000             # Check port 3000
lsof -i :4000             # Check port 4000
lsof -i :54321            # Check Supabase port

# Kill processes on specific ports
kill -9 $(lsof -ti :3000) # Kill process on port 3000
```

### Supabase Issues
```bash
# Reset Supabase local environment
supabase stop
supabase start

# Clear Supabase cache
rm -rf .supabase
supabase start
```

### Environment Variable Issues
```bash
# Verify environment variables are loaded
npm run dev | head -20    # Check startup logs for env vars
echo $NEXT_PUBLIC_SUPABASE_URL  # Verify env var is set
```

## Performance Optimization

### Development Performance
```bash
# Enable Next.js turbo mode
npm run dev --turbo       # Faster builds and hot reload

# Monitor build performance
npm run build --debug     # Detailed build information
npm run analyze           # Bundle analyzer (if configured)
```

### Database Performance
```bash
# Monitor Supabase performance
supabase db logs          # View database logs
supabase functions logs   # View Edge Function logs
```

---

**Document Owner**: Frontend Development Team  
**Last Updated**: Based on consolidation of CLAUDE.md, INITIAL.md, and PLANNING.md  
**Dependencies**: Backend team for port 4000 CORS configuration  
**Related Documents**: 
- [PLANNING.md](./PLANNING.md#architecture) - Architecture overview
- [CLAUDE.md](./CLAUDE.md) - Development workflows
- [INITIAL.md](./INITIAL.md) - Task navigation and progress