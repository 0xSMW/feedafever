# Boot-up Steps for Next.js Migration

1. **Install Node.js**
   - Ensure Node.js 18+ is installed on your machine. You can verify with `node -v`.

2. **Create the Next.js App**
   - Run `npx create-next-app@latest --ts` and provide a project name (e.g., `fever-next`).
   - Enable the `app/` directory and TypeScript when prompted.

3. **Enter the Project Folder**
   - `cd fever-next`

4. **Install Required Packages**
   - RSS parsing: `pnpm add rss-parser`
   - MySQL driver/ORM (choose one):
     - Basic driver: `pnpm add mysql2`
     - OR use Prisma: `pnpm add prisma @prisma/client`
   - Authentication (optional but recommended): `pnpm install next-auth`
   - Additional utilities: `pnpm install dotenv` (for standalone scripts) and any UI library you prefer.

5. **Initialize Prisma (if using)**
   - `npx prisma init` to create the schema and `.env` file.

6. **Configure Environment Variables**
   - Edit `.env.local` (or `.env`) with database credentials and any API keys.

7. **Run the Development Server**
   - `pnpm run dev` to verify the project boots correctly.

These steps will set up a bare Next.js TypeScript project and install the packages needed for further migration work.
