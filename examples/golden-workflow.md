# Golden Workflow: The Practical Playbook

This guide provides the scannable, step-by-step process for all development. It is the practical implementation of the strategy defined in `PLANNING.md`.

### Guiding Philosophy
- **Follow the Happy Path:** Stick to the numbered steps for 99% of your work.
- **Use the Checklist:** Before creating a Pull Request, run through the pre-flight checklist.
- **Avoid Anti-Patterns:** If you're unsure about an action, check the "Don't Do This" list.

---

## 🚀 The Happy Path: From Task Start to Finish

Follow these steps sequentially for every new piece of work.

**1. Sync Your Branch**
- Start from the `main` branch and ensure it's up to date.
  ```bash
  git checkout main
  git pull origin main
  ```

**2. Create Your Feature Branch**
- Create a new branch from main using the `TASKXX/short-description` naming convention.
  ```bash
  git checkout -b TASK01/setup-supabase-auth
  ```

**3. Develop (The "Red-Green-Refactor" Loop)**
- Write a failing test that defines your goal.
- Write the simplest code to make the test pass.
- Refactor and improve the code, ensuring tests still pass.
- Commit atomically. Make small, logical commits with clear messages.
  ```bash
  npm run test
  git add .
  git commit -m "feat(auth): add initial login component"
  git push -u origin TASK01/setup-supabase-auth
  ```

**4. Create the Pull Request (PR)**
- Before creating the PR, run the Pre-Flight Checklist below.
- Open a PR on GitHub from your feature branch into main.
- Ensure all automated checks pass and request a review.

---

## ✅ Pre-Flight Checklist (Before Every PR)

Run these checks locally to ensure your PR will pass review.

- **All Tests Pass:** `npm run test`
- **Code is Linted:** `npm run lint`
- **Types are Correct:** `npm run type-check`
- **Application Builds:** `npm run build`
- **Secrets are Secure:** No keys or secrets are present in the code (`.env` only).
- **Branch is Rebased:** Your feature branch is up to date with main.
  ```bash
  git checkout main
  git pull origin main
  git checkout TASK01/setup-supabase-auth
  git rebase main
  ```

---

## 🚫 The Anti-Pattern Redlist (Don't Do This)

These actions are strictly forbidden.

| Category | Forbidden Action |
|----------|------------------|
| **Security** | Committing secrets, keys, or tokens. Use `.env` files exclusively. |
| **Git Workflow** | Committing directly to main; Force-pushing to shared branches. |
| **Architecture** | Bypassing the Supabase SDK for custom auth/API clients. |
| **Process** | Merging code that fails any automated quality check (test, lint, build). |

---

## 🚨 Emergency Protocols

These actions are high-impact and require extreme caution.

- **Manual Confirmation:** Critical operations like `git reset --hard` or modifying core project documents require explicit approval from the project lead. The AI Agent is programmed to halt and ask for this.
- **Recovery:** If a major error is introduced, the primary recovery method is to revert the problematic Pull Request on GitHub.