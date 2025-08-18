# PRPs Directory

This directory contains Product Requirement Prompts (PRPs) that serve as Layer 2 User Stories in the task tree architecture. PRPs are generated using the `/generate-prp` command and executed with `/execute-prp`.

## Task Tree Architecture

### Layer 1: Features (defined in INITIAL.md)
High-level platform features and capabilities:
- Supabase-First Medical Prescription Platform
- Guest Mode System  
- Privacy-Compliant Data Management
- Real-time Prescription Workflow
- Multi-role Authentication System

### Layer 2: User Stories (PRPs in this directory)
Detailed implementation specifications generated from Layer 1 features:
- `prescription-creation-system.md` - Complete prescription creation workflow
- `guest-mode-authentication.md` - Guest mode and authentication integration
- `supabase-architecture-setup.md` - Supabase-First infrastructure implementation
- `privacy-compliance-implementation.md` - GDPR/HIPAA compliant data models
- `realtime-prescription-tracking.md` - Real-time status and collaboration features

### Layer 3: TDD-Todos (auto-generated during execution)
Granular development tasks created automatically during PRP execution:
- Research and analysis tasks
- Component implementation tasks  
- Testing and validation tasks
- Integration and deployment tasks

## PRP Generation Workflow

1. **Generate PRP**: `/ INITIAL.md`
   - Analyzes feature requirements from INITIAL.md
   - Researches codebase patterns from examples/
   - Creates comprehensive implementation specification
   - Includes validation gates and success criteria

2. **Execute PRP**: `/execute-prp PRPs/[prp-name].md`  
   - Loads complete context from PRP
   - Creates detailed Layer 3 task list
   - Implements each component with validation
   - Ensures all requirements are met

## Expected PRPs

Based on the INITIAL.md specification, the following PRPs should be generated:

### Core Platform PRPs
- [x] `supabase-environment-setup.md` - Supabase project and CLI configuration ✅ **CREATED**
- [ ] `next-js-supabase-integration.md` - Next.js starter kit with Supabase
- [ ] `authentication-system-migration.md` - Complete Supabase Auth integration
- [ ] `guest-mode-system-implementation.md` - Guest mode with route protection

### Medical Platform PRPs  
- [ ] `prescription-creation-workflow.md` - Anonymous prescription creation
- [ ] `medicine-search-integration.md` - TCM medicine database and search
- [ ] `prescription-management-dashboard.md` - Real-time prescription tracking
- [ ] `qr-code-verification-system.md` - QR-based prescription verification

### Compliance & Security PRPs
- [ ] `privacy-compliance-data-models.md` - GDPR/HIPAA compliant data structures
- [ ] `rls-policy-implementation.md` - Row Level Security policies
- [ ] `edge-functions-business-logic.md` - Server-side business logic
- [ ] `stripe-payment-integration.md` - Secure payment processing

### Deployment & Monitoring PRPs
- [ ] `vercel-production-deployment.md` - Production deployment with monitoring
- [ ] `performance-optimization.md` - Performance tuning and optimization
- [ ] `end-to-end-testing.md` - Comprehensive testing strategy

## PRP Quality Standards

Each PRP must include:
- ✅ **Complete Context**: All necessary documentation and patterns
- ✅ **Implementation Plan**: Step-by-step development approach
- ✅ **Validation Gates**: Automated testing and verification steps  
- ✅ **Success Criteria**: Measurable completion standards
- ✅ **Reference Examples**: Links to patterns in examples/ directory
- ✅ **Architecture Compliance**: Supabase-First and privacy compliance requirements

## Usage Instructions

1. **Review INITIAL.md** to understand overall platform requirements
2. **Generate specific PRPs** using `/generate-prp INITIAL.md` with focused requirements
3. **Execute PRPs sequentially** following the 7-week MVP roadmap
4. **Update task tree index** as new PRPs are created and completed
5. **Maintain cross-references** between PRPs for integrated development

This directory serves as the central hub for AI-assisted development workflow, enabling systematic implementation of the complex medical prescription platform.