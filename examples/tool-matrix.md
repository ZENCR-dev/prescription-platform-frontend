# Golden Workflow Tool Matrix

This document defines standardized command aliases and tool integration patterns for consistent development operations.

## 🔧 Command Aliases for Standardized Operations

### Status Monitoring Aliases
- `status-all` → `git status && npm run type-check --noEmit && npm run lint --quiet`
- `branch-health` → `git branch -vv && git fetch origin && git log --oneline -3`
- `env-check` → Verify `.env.local` exists and contains required Supabase variables

### Quality Validation Aliases
- `quality-full` → `npm run test && npm run lint && npm run type-check && npm run build`
- `quality-quick` → `npm run lint && npm run type-check --noEmit`
- `pre-commit` → `npm run test -- --watchAll=false && npm run lint --fix`

### Security Scanning Aliases
- `security-scan` → `npm audit && git log --grep="secret\|key\|password" --oneline`
- `env-audit` → Check for sensitive data in tracked files and verify .env.local is gitignored
- `dependency-check` → `npm audit --audit-level=moderate`

### Emergency Recovery Aliases
- `safe-reset` → `git stash && git checkout main && git pull origin main`
- `backup-current` → `git branch backup-$(date +%Y%m%d-%H%M) && git add -A && git commit -m "emergency backup"`
- `restore-clean` → Reset to last known good state with full backup

## 📊 Tool Integration Matrix

| Operation | Primary Tool | Backup Tool | Emergency Fallback |
|-----------|-------------|-------------|-------------------|
| **Branch Management** | `git` commands | GitHub CLI (`gh`) | Manual GitHub web interface |
| **Code Quality** | `npm run lint` | ESLint CLI | Manual code review |
| **Type Checking** | `npm run type-check` | TypeScript CLI | IDE type checking |
| **Testing** | `npm run test` | Jest CLI | Manual testing |
| **Build Validation** | `npm run build` | Next.js CLI | Local development server |
| **Environment Check** | Custom script | Manual .env verification | Environment template comparison |

## 🔄 Workflow Automation Integration

### Pre-Operation Checklist (Automated via aliases)
1. `status-all` - Verify clean working directory and no type/lint errors
2. `branch-health` - Confirm branch state and remote sync
3. `env-check` - Validate environment configuration
4. `security-scan` - Quick security audit before major operations

### Post-Operation Validation (Automated via aliases)
1. `quality-full` - Complete quality gate validation
2. `security-scan` - Final security check
3. `backup-current` - Create safety backup before commit
4. Document completion in appropriate TASK0X_LOG.md

## ⚡ Performance Optimization

**Parallel Execution Patterns**:
- Run linting and type-checking simultaneously when possible
- Batch security scans with dependency checks
- Combine git operations to reduce I/O overhead

**Caching Strategies**:
- Leverage TypeScript incremental compilation
- Use ESLint cache for faster subsequent runs
- Cache npm audit results for dependency stability

## 🎯 Integration Best Practices

**Command Composition**:
- Chain related operations with `&&` for fail-fast behavior
- Use `||` for fallback command execution
- Implement timeout mechanisms for long-running operations

**Error Handling**:
- Capture and log all command outputs
- Provide clear error messages with remediation steps
- Maintain command execution history for debugging