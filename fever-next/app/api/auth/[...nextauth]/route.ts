import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (user && user.password === credentials.password) {
          return { id: String(user.id), email: user.email };
        }
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
});

export { handler as GET, handler as POST };
