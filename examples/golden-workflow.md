# 🚀 Golden Workflow: The Simple Path

**One-page reference for all development work - no exceptions, no complexity.**

## The 4-Step Happy Path

**1. Start Clean**
```bash
git checkout main && git pull origin main
```

**2. Create Feature Branch** 
```bash
git checkout -b TASKXX/short-description  # e.g., TASK01/supabase-auth
```

**3. Develop & Commit**
```bash
# Code your changes
npm run test && npm run lint && npm run type-check
git add . && git commit -m "feat(scope): clear description"
git push -u origin TASKXX/short-description
```

**4. Create Pull Request**
- Run [Pre-Flight Checklist](#pre-flight-checklist) below
- Open PR on GitHub: feature branch → main
- Wait for automated checks + review approval

---

## ✅ Pre-Flight Checklist

**Run these commands before every PR:**

```bash
npm run test        # ✅ All tests pass
npm run lint        # ✅ Code follows standards  
npm run type-check  # ✅ No TypeScript errors
npm run build       # ✅ Application builds successfully
git status          # ✅ Working directory clean
git log ..@{u}      # ✅ Should return empty (local ahead/equal)
```

**Manual Checks:**
- ✅ No secrets in code (use `.env.local` only)
- ✅ Commit messages reference TASK number
- ✅ Branch name follows `TASKXX/description` pattern

---

## 🚫 Never Do This

| ❌ Forbidden | ✅ Do This Instead |
|-------------|-------------------|
| Commit to `main` directly | Create feature branch + PR |
| Commit secrets/keys | Use `.env.local` exclusively |
| Force-push shared branches | Create new branch if needed |
| Skip quality checks | Run full pre-flight checklist |
| Bypass Supabase SDK | Use official Supabase client |

## 🚨 Emergency Recovery

**If something breaks:**
1. **GitHub**: Revert the problematic PR 
2. **Local**: `git checkout main && git pull origin main`
3. **Nuclear**: Ask team lead for help

**Links:**
- 📖 [Advanced Recovery](./emergency-recovery.md)
- 🔧 [Tool Commands](./tool-matrix.md)