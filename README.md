## 📁 Branch Structure

- **main** (protected)  
  ­­– Production­-ready code, only merged via PRs.
- **develop**  
  – Integration branch; all feature branches merge here first.
- **feature/***  
  – One branch per feature/module, e.g.:  
  &nbsp;&nbsp;&nbsp;&nbsp;• `feature/questions`  
  &nbsp;&nbsp;&nbsp;&nbsp;• `feature/groups`  
  &nbsp;&nbsp;&nbsp;&nbsp;• `feature/test-builder`  
  &nbsp;&nbsp;&nbsp;&nbsp;• `feature/assignments`  
  &nbsp;&nbsp;&nbsp;&nbsp;• `feature/candidate-session`  
  &nbsp;&nbsp;&nbsp;&nbsp;• `feature/grading`

**Workflow**  
1. Create a new `feature/your-feature-name` branch **off** `develop`.  
2. Commit small, focused changes.  
3. Open a PR against `develop`.  
4. Once approved and passing CI, merge into `develop`.  
5. Periodically merge `develop` → `main` for production releases.

---

## ⚙️ Project Setup

1. **Clone the repo**  
   ```bash
   git clone https://github.com/sourav-xponent/quiz-app.git
   cd your-repo
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Generate Prisma client**  
   ```bash
   npx prisma generate
   ```

4. **Start the development server**  
   ```bash
   npm run dev
   ```

5. **Open Prisma Studio** (view seed data)  
   ```bash
   npx prisma studio
   ```
6. **Download any shadcn component 
   ```bash
   npx shadcn add card
   ```

> You can copy `.env.example` to `.env.local` and fill in your credentials:
> ```env
> DATABASE_URL="file:./dev.db"
> NEXTAUTH_URL=http://localhost:3000
> NEXTAUTH_SECRET=your-secret
> SMTP_HOST=…
> SMTP_PORT=…
> SMTP_USER=…
> SMTP_PASS=…
> ```

---

## 🚀 Quick Commands

| Task                            | Command                   |
|---------------------------------|---------------------------|
| Install dependencies            | `npm install`             |
| Generate Prisma Client          | `npx prisma generate`     |
| Run dev server                  | `npm run dev`             |
| View database & seed data       | `npx prisma studio`       |

---

## 📜 Notes

- **Auth** is handled by **NextAuth v5** (credentials provider).  
- **RBAC** middleware inspects `session.user.role` (ADMIN vs CANDIDATE).  
- **UI** uses [shadcn-ui](https://ui.shadcn.com/) + Next.js App Router + Server Actions.  
- **Seed data** is already loaded—no extra migration or seed scripts required.

Happy coding! 🎉
