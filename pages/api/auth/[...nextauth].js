import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../prisma/prisma';

export const authOptions = {
  site: process.env.NEXTAUTH_URL,

  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        name: { label: 'Name', type: 'text', placeholder: 'jsmith' },
        email: { label: 'Email', type: 'email' }
      },
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });
        // Any object returned will be saved in `user` property of the JWT
        // If you return null then an error will be displayed advising the user to check their details.
        // You can also Reject this callback with an Error
        // thus the user will be sent to the error page with the error message as a query parameter
        return user;
      }
    })
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  }
};

export default NextAuth(authOptions);
