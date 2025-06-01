# Feed a Fever - Next.js Migration

A modern reimplementation of the Fever RSS reader, migrating from legacy PHP to Next.js with TypeScript.

## 🔥 About This Project

This repository contains both the original [Fever RSS reader](http://feedafever.com/) PHP codebase and a new Next.js TypeScript implementation. Fever was originally created by Shaun Inman (2008-2009) as a self-hosted RSS aggregator that helped users stay on top of their feeds by highlighting the most discussed items across the web.

### Why Migrate?

The original PHP codebase, while functional, uses outdated technologies and dependencies. This migration effort aims to:

- **Modernize the stack**: Move from PHP to Next.js with TypeScript
- **Improve maintainability**: Leverage modern tooling and best practices
- **Enhance performance**: Utilize React's efficient rendering and Next.js optimizations
- **Better developer experience**: TypeScript, hot reloading, and modern debugging tools
- **Future-proof**: Easier to extend and maintain with current web standards

## 📁 Project Structure

```
feedafever/
├── fever-next/          # New Next.js TypeScript implementation
│   ├── app/            # Next.js 13+ app directory
│   └── public/         # Static assets
├── firewall/           # Original PHP Fever codebase
│   ├── app/           # PHP application logic
│   ├── config/        # Configuration files
│   └── views/         # PHP templates
├── boot-up.md         # Next.js setup instructions
├── the-plan.md        # Detailed migration roadmap
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed on your machine
- MySQL database for data storage
- Basic familiarity with Next.js and TypeScript

### Setup the Next.js Application

1. **Navigate to the Next.js project:**
   ```bash
   cd fever-next
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database credentials
   ```

4. **Set up the database:**
   ```bash
   # If using Prisma
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

For detailed setup instructions, see [`boot-up.md`](./boot-up.md).

## 📋 Migration Roadmap

The migration follows a comprehensive 9-step plan detailed in [`the-plan.md`](./the-plan.md):

- [x] **Project Setup** - Next.js TypeScript foundation
- [x] **Database Schema** - Recreate PHP database structure with Prisma/TypeScript
- [x] **API Endpoints** - Convert PHP routes to Next.js API routes
- [x] **Feed Processing** - Replace SimplePie with modern RSS parsing
- [x] **Front-end Pages** - Convert PHP views to React components
- [x] **Authentication** - Implement secure session management
- [x] **Configuration & Install Flow** - Guided setup wizard
- [ ] **Testing & Validation** - Comprehensive test suite
- [ ] **Deployment** - Production-ready deployment guide

## 🛠 Technology Stack

### Original (PHP)
- PHP 5.x+
- MySQL
- SimplePie (RSS parsing)
- Custom MVC framework

### New (Next.js)
- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Database**: MySQL with Prisma ORM
- **RSS Parsing**: rss-parser
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS (planned)
- **Testing**: Jest + Playwright (planned)

## 🔧 Development

### Working with the Original PHP Code

The original Fever PHP application is preserved in the `firewall/` directory. To run it:

1. Set up a PHP environment (PHP 5.6+ recommended)
2. Configure MySQL database
3. Follow the installation steps in [`README.txt`](./README.txt)
4. Access via `http://yourdomain.com/fever/boot.php`

### Contributing to the Next.js Migration

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following the migration plan
4. **Test thoroughly** - ensure compatibility with original functionality
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write tests for new functionality
- Document API changes and breaking changes

### Scheduled Feed Refresh

Vercel Cron Jobs automatically call `/api/cron` every ten minutes to update feeds. Set `CRON_SECRET` in your environment and configure the job in `vercel.json`.

```
{
  "crons": [{
    "path": "/api/cron",
    "schedule": "*/10 * * * *"
  }]
}
```

Your cron endpoint checks the `Authorization` header against `CRON_SECRET` to prevent unauthorized requests.


## 📖 Documentation

- [`boot-up.md`](./boot-up.md) - Initial setup instructions for Next.js
- [`the-plan.md`](./the-plan.md) - Detailed migration strategy and roadmap
- [`README.txt`](./README.txt) - Original Fever installation instructions

## ⚠️ Important Notes

### Copyright & Licensing

The original Fever application is **Copyright 2008-2009 Shaun Inman**. The original package cannot be redistributed without permission from [shauninman.com](http://shauninman.com/).

This migration project is intended for:
- Educational purposes
- Personal use by existing Fever license holders
- Community development of modern alternatives

**Please respect the original author's copyright and licensing terms.**

### Status

🚧 **This project is currently under active development.** The Next.js implementation is not yet feature-complete. The original PHP version in the `firewall/` directory remains the stable, production-ready version.

## 🤝 Contributing

We welcome contributions! Whether you're:
- 🐛 Fixing bugs
- ✨ Adding new features  
- 📝 Improving documentation
- 🧪 Writing tests
- 🎨 Enhancing the UI

Please see our contribution guidelines and the migration roadmap in [`the-plan.md`](./the-plan.md).

## 📞 Support

- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: Use GitHub Discussions for questions and community chat
- **Original Fever**: Visit [feedafever.com](http://feedafever.com/) for the original application

## 🔗 Links

- [Original Fever Website](http://feedafever.com/)
- [Shaun Inman's Website](http://shauninman.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**Note**: This is an unofficial community-driven migration project. It is not affiliated with or endorsed by Shaun Inman or the original Fever development team.
