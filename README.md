# 🏥 Traditional Chinese Medicine Prescription Platform - Frontend

## 📚 Document Architecture

### Governance Documents Location
- **Active Development**: All governance documents available in `main` branch for immediate reference
- **Authoritative Source**: `docs-main` branch serves as the protected editing environment for governance docs
- **Sync Process**: Changes to governance docs made in `docs-main` → PR to `main`

### Quick Navigation
- 🎯 **Start Here**: [`INITIAL.md`](./INITIAL.md) - Task navigation and current status
- 📋 **Execution Rules**: [`CLAUDE.md`](./CLAUDE.md) - AI collaboration and development workflows
- 🏛️ **Strategic Context**: [`PLANNING.md`](./PLANNING.md) - Architecture constraints and phase objectives
- 📖 **Development Guide**: [`FRONTEND_PLAYBOOK.md`](./FRONTEND_PLAYBOOK.md) - PRP generation and collaboration protocols
- 🔄 **Git Workflow**: [`examples/golden-workflow.md`](./examples/golden-workflow.md) - Branch management and quality gates

### Branch Strategy
```
main              ← Active development with stable governance docs
├── TASK01/feat   ← Feature branches following TASKXX/description pattern
├── TASK02/setup  
└── docs-main     ← Protected governance document editing (authoritative source)
```

## 🚀 Development Quick Start

1. **Check Position**: Review [`INITIAL.md`](./INITIAL.md) progress tracker
2. **Read Context**: Understand constraints in [`PLANNING.md`](./PLANNING.md)
3. **Get Tasks**: Open specific `PRPs/TASK0X.md` for atomic tasks
4. **Follow Workflow**: Execute using [`examples/golden-workflow.md`](./examples/golden-workflow.md)

## 🔧 Environment Setup

See [`DevEnv.md`](./DevEnv.md) for:
- Port allocation & CORS configuration
- Development commands & scripts
- Supabase setup & troubleshooting
- Quality gates (lint, test, build)

---

**Project**: Medical prescription platform frontend UI/UX development  
**Framework**: Next.js 14 + App Router + Supabase Client  
**Architecture**: Supabase-First with client-side integration focus