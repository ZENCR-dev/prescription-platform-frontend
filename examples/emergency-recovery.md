# Enhanced Emergency Recovery Protocol

This document provides detailed emergency response procedures and recovery protocols for critical system failures.

## 🚨 Immediate Response Procedures

**STOP Conditions** (Immediate halt required):
- Any operation exposing sensitive data (API keys, patient info, credentials)
- Build failures persisting beyond 15 minutes with no clear resolution path
- Test failures indicating broken core functionality (authentication, data access)
- Git operations resulting in branch corruption or merge conflicts
- Environment variable misconfiguration breaking application startup

## 📊 Recovery Decision Matrix

| Severity | Response Time | Action Required | Authority Level |
|----------|---------------|-----------------|-----------------|
| **CRITICAL** | Immediate | Full stop + rollback | User approval required |
| **HIGH** | 5 minutes | Pause + assessment | AI can proceed with caution |
| **MEDIUM** | 15 minutes | Log + continue | Standard workflow |
| **LOW** | 1 hour | Monitor + document | No special action |

## 🔄 Automated Recovery Procedures

### Level 1: Safe Rollback (No user approval needed)
```bash
# Automated safe rollback to last known good state
git stash push -m "emergency-stash-$(date +%Y%m%d-%H%M%S)"
git checkout main
git pull origin main
git status  # Verify clean state
```

### Level 2: Backup & Reset (User confirmation required)
```bash
# Create emergency backup before drastic action
git branch emergency-backup-$(date +%Y%m%d-%H%M%S)
git add -A
git commit -m "emergency backup before reset"
# WAIT FOR USER CONFIRMATION: "EMERGENCY RESET APPROVED"
git reset --hard origin/main
```

### Level 3: Project Restoration (Full user authorization required)
```bash
# Complete project restoration from backup branch
# REQUIRES EXPLICIT USER COMMAND: "RESTORE FROM BACKUP [backup-branch-name]"
git checkout [backup-branch-name]
git checkout -b recovery-$(date +%Y%m%d-%H%M%S)
# Manual verification and selective restoration required
```

## 🛡️ Security Incident Response

### Data Exposure Detection
1. **Immediate Action**: Stop all operations, do not commit or push
2. **Assessment**: Identify scope of exposure (keys, PII, credentials)
3. **Containment**: Remove sensitive data from working directory
4. **Recovery**: Reset to pre-exposure state, regenerate compromised secrets
5. **Prevention**: Update .gitignore and security scanning procedures

### Authentication Failure Response
1. **Verify Environment**: Check `.env.local` for correct Supabase configuration
2. **Test Connection**: Validate Supabase project URL and keys
3. **Reset Auth State**: Clear browser storage and restart development server
4. **Escalate**: If persistent, request user to verify Supabase project status

## 📢 Communication Protocols

### User Notification Templates
- **Critical**: "🚨 CRITICAL: [Issue] detected. All operations halted. Backup created at [branch]. Awaiting your guidance."
- **Recovery**: "🔄 RECOVERY: Attempting [action]. Backup available at [branch]. You can halt with CTRL+C."
- **Success**: "✅ RECOVERED: [Action] completed. System restored to [state]. Ready to continue."

### Escalation Procedures
1. **Auto-Recovery Failed** → Present user with specific recovery options
2. **User Guidance Needed** → Provide detailed context and recommend actions
3. **Manual Intervention Required** → Stop all automated processes, request explicit instructions

## ✅ Post-Recovery Validation

### System Health Check (Must pass before continuing)
```bash
npm run test          # All tests must pass
npm run lint         # No linting errors
npm run type-check   # No TypeScript errors
npm run build        # Application must build successfully
git status           # Working directory must be clean
```

### Recovery Documentation
- Log incident details in appropriate TASK0X_LOG.md
- Document root cause and prevention measures
- Update emergency procedures if new scenarios discovered
- Record recovery time and effectiveness metrics

## 🎯 Recovery Training Scenarios

**Common Recovery Patterns**:
1. **Merge Conflict Resolution**: `git merge --abort` → manual resolution → retry
2. **Environment Variable Issues**: Restore `.env.local` from backup or template
3. **Dependency Conflicts**: `rm -rf node_modules package-lock.json` → `npm install`
4. **Test Suite Failures**: Isolate failing tests → fix individually → verify suite
5. **Build Process Errors**: Clear Next.js cache → verify environment → rebuild