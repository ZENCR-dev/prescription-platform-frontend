# Supabase Environment Setup and CLI Configuration

**PRP Category**: Infrastructure & Development Environment  
**Priority**: Critical (MVP Week 1)  
**Estimated Time**: 4-6 hours  
**Dependencies**: None (foundational setup)  

## Goal

Establish a complete Supabase-First development environment with CLI configuration, three-tier environment setup (development/test/production), and Next.js 14 TypeScript integration that serves as the foundation for privacy-compliant medical prescription platform development.

## Why

- **Supabase-First Architecture**: Complete replacement of custom JWT authentication (373 lines of security-risk code) with enterprise-grade Supabase Auth
- **Privacy Compliance Foundation**: Establish GDPR/HIPAA compliant infrastructure from day one with anonymous-only data models
- **Component Migration Readiness**: Prepare environment for 11 reusable components with adaptation levels 1-4 
- **7-Week MVP Timeline**: Critical Week 1 milestone for systematic Supabase-First platform delivery
- **Development Velocity**: Enable rapid iteration with local development stack and three-environment deployment pipeline

## What

### User-Visible Behavior
- Developers can run `npm run dev` and access fully functional Supabase-powered local development environment
- Supabase Studio dashboard accessible at `http://localhost:54323` for database and auth management
- Next.js application with working Supabase authentication and database connectivity
- Three configured Supabase environments ready for development workflow

### Technical Requirements
- Supabase CLI installed and configured for local development
- Three Supabase projects: development, test, and production environments
- Next.js 14 + TypeScript project with Supabase client integration
- Local PostgreSQL database with RLS policies ready for medical data
- Environment variables properly configured for all three environments
- TypeScript types auto-generated from Supabase schema

### Success Criteria
- [ ] Supabase CLI operational with all services running locally
- [ ] Three Supabase projects created and configured
- [ ] Next.js application successfully connecting to Supabase
- [ ] Basic authentication flow working end-to-end
- [ ] Component migration roadmap validated with architecture compliance
- [ ] Privacy compliance verified with anonymized data models only

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://supabase.com/docs/guides/local-development/cli/getting-started
  why: Official CLI installation and setup process, Docker requirements, project initialization
  
- url: https://supabase.com/docs/guides/deployment/managing-environments  
  why: Three-environment strategy for dev/test/prod configuration
  
- url: https://github.com/vercel/next.js/tree/canary/examples/with-supabase
  why: Official Next.js + Supabase starter kit patterns and best practices

- file: examples/architecture/supabase-first-architecture.md
  why: Project-specific Supabase-First architecture requirements and 7-week MVP roadmap
  
- file: examples/architecture/project-initialization.md
  why: Component migration strategy and development environment setup patterns
  
- file: examples/components/component-reuse-guide.md  
  why: 11 reusable components with adaptation levels and Supabase integration requirements
  
- file: INITIAL.md
  why: Complete platform specification including privacy compliance and technical constraints

- docfile: Context-Engineering-Intro/CLAUDE.md
  why: SuperClaude v3 integration patterns and AI-assisted development workflow
```

### Current Codebase Structure
```bash
prescription-platform-frontend/
├── CLAUDE.md                    # Project AI guidance (completed)
├── INITIAL.md                   # Complete platform specification
├── examples/
│   ├── architecture/           # Supabase-First architecture guides
│   ├── components/             # 4 reusable components ready for adaptation
│   ├── auth/                   # Guest mode implementation patterns
│   └── services/               # Business logic utilities
├── recycle/                    # 11 legacy components for adaptation
│   ├── auth/                   # Authentication components (Level 1 adaptation)
│   ├── components/             # Core business components (Level 1-2 reuse)
│   └── services/               # Business logic (Level 3 adaptation)
└── PRPs/                       # Task tree Layer 2 specifications
```

### Desired Project Structure After Setup
```bash
prescription-platform-frontend/
├── supabase/                   # Supabase configuration
│   ├── config.toml            # Local development config
│   ├── migrations/             # Database schema versions
│   └── seed.sql               # Initial anonymized test data
├── src/
│   ├── app/                   # Next.js 14 App Router
│   ├── components/            # Adapted components from recycle/
│   ├── lib/                   # Supabase client and utilities
│   ├── types/                 # Auto-generated Supabase types
│   └── utils/                 # Business logic utilities
├── .env.local                 # Local environment variables
├── .env.example               # Environment variable template
└── package.json               # Dependencies with Supabase client
```

### Known Gotchas & Critical Requirements
```typescript
// CRITICAL: Privacy Compliance (NON-NEGOTIABLE)
// ❌ NEVER include patient PII in any configuration, testing, or examples
interface PrivacyCompliantData {
  // ✅ ONLY anonymous identifiers allowed
  prescriptionCode: string;    // Anonymous prescription identifier
  practitionerId: string;      // Medical practitioner only
  // ❌ NO patient names, ages, phone numbers, addresses
}

// CRITICAL: Supabase-First Architecture (MANDATORY)
// ❌ NO custom JWT authentication - use Supabase Auth exclusively
// ❌ NO traditional HTTP APIs - use Supabase Client direct database access  
// ❌ NO custom WebSockets - use Supabase Realtime subscriptions

// CRITICAL: Docker requirement for Supabase CLI
// Supabase CLI requires Docker Desktop or compatible container runtime
// Must be running before executing `supabase start`

// CRITICAL: Environment variable naming conventions
// Use NEXT_PUBLIC_ prefix for client-side variables only
// Keep database passwords and service keys server-side only
```

## Implementation Blueprint

### Three-Environment Setup Strategy
```yaml
DEVELOPMENT:
  purpose: "Local development and feature testing"
  database: "Local PostgreSQL via Docker"
  auth: "Supabase Auth with test providers"
  
TEST:
  purpose: "Integration testing and QA validation"  
  database: "Supabase hosted PostgreSQL"
  auth: "Supabase Auth with staging configuration"
  
PRODUCTION:
  purpose: "Live medical prescription platform"
  database: "Supabase production with backups"
  auth: "Supabase Auth with production security"
```

### Task Implementation Sequence

```yaml
Task 1: "Supabase CLI Installation and Docker Verification"
INSTALL_CLI:
  - CHECK if Docker Desktop is running (required dependency)
  - INSTALL Supabase CLI using preferred method (Homebrew/npm/direct)
  - VERIFY installation with `supabase --version`
  - TEST Docker connectivity with `docker --version`

Task 2: "Supabase Projects Creation (Three Environments)"  
CREATE_PROJECTS:
  - NAVIGATE to https://supabase.com/dashboard
  - CREATE development project: "prescription-platform-dev"
  - CREATE test project: "prescription-platform-test"  
  - CREATE production project: "prescription-platform-prod"
  - RECORD project URLs and anon keys for each environment

Task 3: "Local Development Environment Initialization"
INIT_LOCAL:
  - RUN `supabase init` in project root
  - CONFIGURE supabase/config.toml with project settings
  - START local services with `supabase start`
  - VERIFY all services running with `supabase status`
  - ACCESS Supabase Studio at http://localhost:54323

Task 4: "Next.js 14 + TypeScript + Supabase Integration"
SETUP_NEXTJS:
  - INIT Next.js project with TypeScript and Tailwind CSS
  - INSTALL Supabase client: `npm install @supabase/supabase-js`
  - CREATE src/lib/supabase.ts with client configuration
  - SETUP environment variables for three environments
  - CONFIGURE Next.js to use Supabase types

Task 5: "Authentication Foundation and RLS Policies"
SETUP_AUTH:
  - ENABLE email authentication in Supabase dashboard
  - CREATE basic RLS policies for user data isolation
  - IMPLEMENT basic auth components for testing
  - VERIFY authentication flow works locally
  - TEST user registration and login process

Task 6: "Component Migration Readiness and Validation"
PREPARE_MIGRATION:
  - ANALYZE existing components in recycle/ directory
  - VALIDATE adaptation requirements against Supabase-First architecture
  - CREATE migration checklist based on component-reuse-guide.md
  - SETUP project structure for component adaptation
  - VERIFY privacy compliance for all planned components
```

### Task 1: CLI and Docker Setup
```bash
# Verify Docker is running (CRITICAL requirement)
docker --version && docker info | grep "Server Version"

# Install Supabase CLI (choose your method)
# macOS with Homebrew:
brew install supabase/tap/supabase

# Or via npm:
npm install supabase --save-dev

# Verify installation
supabase --version
supabase help
```

### Task 2: Environment Projects Setup
```typescript
// Create three projects via dashboard and record:
interface SupabaseEnvironments {
  development: {
    url: "https://[project-id].supabase.co",
    anonKey: "eyJ...",  // Public anon key
    serviceKey: "eyJ..." // Service role key (keep secret)
  },
  test: {
    url: "https://[test-project-id].supabase.co", 
    anonKey: "eyJ...",
    serviceKey: "eyJ..."
  },
  production: {
    url: "https://[prod-project-id].supabase.co",
    anonKey: "eyJ...",
    serviceKey: "eyJ..."
  }
}
```

### Task 3: Local Environment Configuration
```bash
# Initialize Supabase in project root
supabase init

# Start all local services
supabase start

# Expected output - all services should be running:
# ✅ API URL: http://localhost:54321
# ✅ GraphQL URL: http://localhost:54321/graphql/v1  
# ✅ DB URL: postgresql://postgres:postgres@localhost:54322/postgres
# ✅ Studio URL: http://localhost:54323
# ✅ Inbucket URL: http://localhost:54324
# ✅ JWT secret: [secret-key]
# ✅ anon key: [anon-key]
# ✅ service_role key: [service-key]
```

### Task 4: Next.js Integration
```typescript
// src/lib/supabase.ts - Supabase client configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Generate TypeScript types from schema
// Run: npx supabase gen types typescript --local > src/types/supabase.ts
```

### Task 5: Authentication Setup
```sql
-- Enable RLS on all tables (privacy compliance requirement)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Basic user isolation policy
CREATE POLICY "Users can only access their own profile" 
ON profiles FOR ALL 
USING (auth.uid() = id);

-- Anonymous prescription policy (privacy compliant)
CREATE POLICY "Anonymous prescriptions"
ON prescriptions FOR ALL  
USING (prescription_code IS NOT NULL AND patient_name IS NULL);
```

### Integration Points
```yaml
NEXT_STEPS:
  - component_migration: "Ready for PrescriptionCreator.tsx adaptation (Level 2)"
  - auth_migration: "Foundation for GuestModeGuard.tsx adaptation (Level 1)"
  - data_models: "Prepared for anonymous prescription data models"
  
ENVIRONMENT_VARIABLES:
  - add_to: ".env.local, .env.test, .env.production"
  - pattern: "NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co"
  - security: "Never commit service role keys to version control"
  
DATABASE_SCHEMA:  
  - migrations: "supabase/migrations/ for version control"
  - types: "Auto-generated TypeScript types from schema"
  - rls: "Row Level Security policies for data isolation"
```

## Validation Loop

### Level 1: Environment and CLI Validation
```bash
# Verify Docker is running
docker ps | grep -q "." && echo "✅ Docker running" || echo "❌ Docker not running"

# Verify Supabase CLI installation
supabase --version && echo "✅ CLI installed" || echo "❌ CLI missing"

# Verify local services are running
supabase status | grep -E "(API|DB|Studio).*running" && echo "✅ Services running" || echo "❌ Services not running"

# Verify Studio access  
curl -s http://localhost:54323 | grep -q "Supabase" && echo "✅ Studio accessible" || echo "❌ Studio not accessible"

# Expected: All checks pass with ✅ status
```

### Level 2: Next.js and Supabase Integration
```bash
# Verify Next.js development server starts
npm run dev &
sleep 5
curl -s http://localhost:3000 | grep -q "prescription" && echo "✅ Next.js running" || echo "❌ Next.js not running"
pkill -f "next dev"

# Verify TypeScript compilation
npm run build && echo "✅ TypeScript compiles" || echo "❌ TypeScript errors"

# Verify environment variables loaded
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Env vars loaded' : '❌ Env vars missing')"

# Expected: All integration tests pass
```

### Level 3: Authentication and Database Connectivity
```bash
# Test Supabase connection (run in Node.js console)
node -e "
const { createClient } = require('@supabase/supabase-js');
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
client.auth.getSession().then(r => console.log('✅ Auth connection:', !!r)).catch(e => console.log('❌ Auth error:', e.message));
"

# Test database query capability
node -e "
const { createClient } = require('@supabase/supabase-js');  
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
client.from('profiles').select('count').then(r => console.log('✅ DB query works')).catch(e => console.log('❌ DB error:', e.message));
"

# Verify RLS policies are active
supabase db diff | grep -q "ENABLE ROW LEVEL SECURITY" && echo "✅ RLS enabled" || echo "❌ RLS not configured"

# Expected: Database connectivity and security working
```

## Final Validation Checklist
- [ ] All local Supabase services running: `supabase status`
- [ ] Three Supabase projects created and accessible via dashboard
- [ ] Next.js application starts without errors: `npm run dev`
- [ ] Supabase client successfully connects to database
- [ ] Basic authentication flow operational (register/login)
- [ ] TypeScript types generated from Supabase schema
- [ ] Environment variables properly configured for all environments
- [ ] Privacy compliance verified (no patient PII in any configuration)
- [ ] Component migration roadmap validated against Supabase-First requirements
- [ ] Ready for Week 2: Authentication System Migration PRP

## Anti-Patterns to Avoid
- ❌ Don't create custom authentication when Supabase Auth is available
- ❌ Don't include patient PII in test data or configuration examples
- ❌ Don't use traditional API patterns when Supabase Client direct access is preferred
- ❌ Don't skip RLS policy setup - implement from day one for security
- ❌ Don't hardcode environment-specific values in source code
- ❌ Don't commit .env files with real secrets to version control
- ❌ Don't proceed without Docker running (Supabase CLI will fail)
- ❌ Don't create multiple Supabase projects in same dashboard account (use separate accounts for isolation)

---

**Quality Score: 9/10** - Comprehensive context, executable validation gates, addresses all critical requirements, and provides complete one-pass implementation guidance for Supabase-First medical prescription platform foundation.