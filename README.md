# nextjs-starter-pack

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
  <br />
  <img src="https://img.shields.io/badge/TanStack_Query-5.x-FF4154?style=for-the-badge&logo=react-query" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/React_Hook_Form-7.x-EC5990?style=for-the-badge&logo=react-hook-form" alt="React Hook Form" />
  <img src="https://img.shields.io/badge/Zod-Latest-3068B7?style=for-the-badge" alt="Zod" />
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

## ✨ Features

- ⚡️ **Next.js 15 (App Router)**
- ⚛️ **React 19**
- 🔷 **TypeScript**
- 🎨 **Tailwind CSS v4**
- 🌓 **Dark Mode (next-themes)**
- 🧩 **Shadcn UI**
- 🖼️ **Lucide Icons**
- 🛠️ **ESLint and Prettier**
- 📦 **Import Aliases**
- 📊 **TanStack Query**
- 📋 **React Hook Form**
- 🛡️ **Zod Validation**
- 🔄 **Zustand / Jotai**
- 📁 **Prisma ORM**
- 🔐 **Auth.js / Clerk**

## 🛠️ CLI Options

| Option                  | Description                                |
| ----------------------- | ------------------------------------------ |
| `[projectName]`         | Name of your project                       |
| `-d, --dark-mode`       | Dark mode with next-themes                 |
| `-r, --rhf`             | React Hook Form with Zod                   |
| `-q, --tanstack-query`  | TanStack Query                             |
| `-s, --state <library>` | State management with `zustand` or `jotai` |
| `-p, --prisma`          | Prisma ORM                                 |
| `-a, --auth <library>`  | Authentication with `authjs` or `clerk`    |

## 🛣️ Roadmap

- [ ] 📁 Drizzle ORM
- [ ] 📊 Analytics
- [ ] 🧪 Testing - Jest, RTL, and Cypress support
- [ ] 💳 Stripe integration
- [ ] 🌐 i18n
- [ ] 🔒 Security headers and best practices
- [ ] 📱 Progressive Web App capabilities
- [ ] 🎭 Storybook - Component documentation
- [ ] 🔄 CI/CD
- [ ] 📧 Email templates and sending capabilities

## 📁 Project Structure

```py
my-app/
├── prisma/            # DB schema & seeding
├── src/
│   ├── app/           # App router (layout, routes, API)
│   ├── components/    # Reusable UI (Shadcn UI)
│   ├── actions/       # Server actions
│   ├── store/         # Zustand/Jotai
│   ├── lib/           # Helpers & utils
│   └── context/       # Context providers
└── config + setup     # ESLint, Prettier, TypeScript, etc.
```

## 👥 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch from `develop`
3. Commit and push your changes to the branch
4. Open a Pull Request to `develop`

Please make sure to follow the existing code style of the project.
<br/>
<br/>

<p align="center">
  ⭐ If you find this project useful, please consider giving it a star! ⭐
</p>
