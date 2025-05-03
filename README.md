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
  A modern, customizable starter template for Next.js applications with all the essential integrations ready to go.
</p>

## ✨ Features

Create a powerful Next.js application with zero configuration. This starter pack includes:

- ⚡️ **Next.js 15** - The latest version with App Router and enhanced performance
- ⚛️ **React 19** - Utilizing the newest React features
- 🔷 **TypeScript** - For type safety and improved developer experience
- 🎨 **Tailwind CSS v4** - For rapid UI development
- 🌓 **Dark Mode** - Integrated with next-themes for seamless theme switching
- 📊 **Data Fetching** - TanStack Query for efficient data management
- 📋 **Form Handling** - React Hook Form with optional Zod validation
- 🔄 **State Management** - Options for Zustand or Jotai
- 🛠️ **Development Tools** - ESLint and Prettier configurations
- 📦 **Import Aliases** - For cleaner imports
- 🔍 **Icons** - Lucide React for beautiful, customizable icons

## 📦 Quick Start

Create a new project with a single command:

```bash
npx nextjs-starter-pack
```

Or with customization options:

```bash
npx nextjs-starter-pack my-app --dark-mode --form rhf-zod --tanstack-query --state zustand
```

## 🛠️ CLI Options

| Option               | Description                                                                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `[projectName]`      | Name of your project                                                                                                                           |
| `--dark-mode`        | Include dark mode with next-themes                                                                                                             |
| `--form <validator>` | Choose form validator:<br/>• `rhf` - React Hook Form<br/>• `rhf-zod` - React Hook Form with Zod<br/>• `none` - No form library                 |
| `--tanstack-query`   | Include TanStack Query                                                                                                                         |
| `--state <library>`  | Choose state management library:<br/>• `zustand` - Zustand state management<br/>• `jotai` - Jotai atomic state<br/>• `none` - No state library |

## 🛣️ Roadmap

- [ ] 🔐 **Authentication** - Next Auth integration for secure user sessions
- [ ] 📁 **Database ORM** - Choose between Prisma and Drizzle
- [ ] 📝 **Sample Code** - Add more examples for all included libraries
- [ ] 📊 **Analytics** - Integration with popular analytics platforms
- [ ] 🧪 **Testing** - Jest, React Testing Library, and Cypress support
- [ ] 💳 **Payments** - Stripe integration for e-commerce applications
- [ ] 🌐 **i18n** - Internationalization and localization support
- [ ] 🔒 **Security** - Security headers and best practices
- [ ] 🏎️ **Performance** - Image optimization and core web vitals
- [ ] 📱 **PWA** - Progressive Web App capabilities
- [ ] 🎭 **Storybook** - Component documentation
- [ ] 🔄 **CI/CD** - Continuous integration and deployment
- [ ] 📧 **Email** - Email templates and sending capabilities
- [ ] 🤖 **API** - Example API routes and patterns

## 📁 Project Structure

```
my-app/
├── app/                   # Next.js App Router
├── components/            # React components
│   ├── ui/                # UI components
│   └── forms/             # Form components
├── lib/                   # Utility functions
├── public/                # Static files
├── .eslintrc.json         # ESLint configuration
└── .prettierrc            # Prettier configuration
```

## 👥 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch
3. Commit and push your changes to the branch
4. Open a Pull Request

Please make sure to update tests as appropriate and follow the code style of the project.
<br/>
<br/>

<p align="center">
  ⭐ If you find this project useful, please consider giving it a star! ⭐
</p>
