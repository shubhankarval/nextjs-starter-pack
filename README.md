# nextjs-starter-pack

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
  <br />
  <img src="https://img.shields.io/badge/TanStack_Query-5.x-FF4154?style=for-the-badge&logo=reactquery" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/Prisma-6.x-0a3953?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Drizzle-0.x-c6f853?style=for-the-badge&logo=drizzle" alt="Drizzle" />
  <img src="https://img.shields.io/badge/Auth.js-5.x-fb7d05?style=for-the-badge" alt="Auth.js" />
  <img src="https://img.shields.io/badge/Clerk-6.x-aa9dec?style=for-the-badge&logo=clerk" alt="Clerk" />
  <br />
  <img src="https://img.shields.io/badge/React_Hook_Form-7.x-EC5990?style=for-the-badge&logo=react-hook-form" alt="React Hook Form" />
  <img src="https://img.shields.io/badge/Zod-3.x-3068B7?style=for-the-badge&logo=zod" alt="Zod" />
  <img src="https://img.shields.io/badge/Zustand-5.x-433e38?style=for-the-badge" alt="Zustand" />
  <img src="https://img.shields.io/badge/Jotai-2.x-f2f2f2?style=for-the-badge" alt="Jotai" />
</div>

<p align="center">
  A modern, customizable Next.js starter with all the essential integrations. Zero configuration required.
</p>

## 📦 Quick Start

Create a new project with a single command:

```bash
npx nextjs-starter-pack
```

Or with customization options:

```bash
npx nextjs-starter-pack my-app --dark-mode --state zustand
```

## CLI Options

| Option                  | Description                                |
| ----------------------- | ------------------------------------------ |
| `[projectName]`         | Name of your project                       |
| `-d, --dark-mode`       | Dark mode with next-themes                 |
| `-r, --rhf`             | React Hook Form with Zod                   |
| `-q, --tanstack-query`  | TanStack Query                             |
| `-s, --state <library>` | State management with `zustand` or `jotai` |
| `-o, --orm <library>`   | Querying with ORM (`prisma` or `drizzle`)  |
| `-a, --auth <library>`  | Authentication with `authjs` or `clerk`    |
| `-i, --skip-install`    | Skip installing dependencies               |

## Project Structure

```py
my-app/
├── src/
│   ├── app/           # App router (layout, routes, API)
│   ├── components/    # Reusable UI (Shadcn UI)
│   ├── actions/       # Server actions
│   ├── store/         # Zustand/Jotai
│   ├── lib/           # Helpers & utils
│   └── context/       # Context providers
├── prisma/            # DB schema & seeding
├── drizzle/           # DB migrations
└── config + setup     # ESLint, Prettier, TypeScript, etc.
```

## Roadmap

- [ ] CI/CD (deployment with vercel)
- [ ] Testing - Jest, RTL, and Cypress support
- [ ] Stripe integration
- [ ] i18n
- [ ] Analytics
- [ ] Security headers and best practices
- [ ] Progressive Web App capabilities
- [ ] Storybook - Component documentation
- [ ] Email templates and sending capabilities

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch from `develop`
3. Commit and push your changes to the branch
4. Open a Pull Request to `develop`

Please make sure to follow the existing code style of the project.

### Development & Testing

For local development and testing, see the [`nextjs-starter-app`](https://github.com/shubhankarval/nextjs-starter-app) repository - a reference implementation showcasing the output of this starter pack.
<br/>
<br/>

<p align="center">
  ⭐ If you find this project useful, please consider giving it a star! ⭐
</p>
