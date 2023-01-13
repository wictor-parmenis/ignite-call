import { Adapter } from 'next-auth/adapters'
import { prisma } from '../prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { destroyCookie, parseCookies } from 'nookies'

export function PrismaAdapter(
  req: NextApiRequest,
  res: NextApiResponse,
): Adapter {
  return {
    async createUser(user) {
      const { '@ignitecall:userId': userIdOnCookies } = parseCookies({ req })

      if (!userIdOnCookies) {
        throw new Error('User id not found on cookies')
      }

      const prismaUser = await prisma.user.update({
        where: { id: userIdOnCookies },
        data: {
          fullname: user.fullname,
          avatar_url: user?.avatar_url,
          email: user.email,
        },
      })

      destroyCookie({ res }, '@ignitecall:userId', { path: '/' })

      return {
        email: prismaUser?.email!,
        emailVerified: null,
        id: prismaUser?.id,
        fullname: prismaUser?.fullname,
        avatar_url: prismaUser?.avatar_url!,
        username: prismaUser?.username,
      }
    },
    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (!user) {
        return null
      }

      return {
        email: user?.email!,
        emailVerified: null,
        id: user?.id,
        fullname: user?.fullname,
        avatar_url: user?.avatar_url!,
        username: user?.username,
      }
    },
    async getUserByEmail(email) {
      const prismaUser = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!prismaUser) {
        return null
      }

      return {
        email: prismaUser?.email!,
        emailVerified: null,
        id: prismaUser?.id,
        fullname: prismaUser?.fullname,
        avatar_url: prismaUser?.avatar_url!,
        username: prismaUser?.username,
      }
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },
        include: {
          user: true,
        },
      })

      if (!account) {
        return null
      }

      const { user } = account

      return {
        email: user?.email!,
        emailVerified: null,
        id: user?.id,
        fullname: user?.fullname,
        avatar_url: user?.avatar_url!,
        username: user?.username,
      }
    },
    async updateUser(user) {
      const userComplete = await prisma.user.findUniqueOrThrow({
        where: {
          id: user.id!,
        },
      })
      const prismaUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          avatar_url: userComplete?.avatar_url,
          email: userComplete.email,
          fullname: userComplete?.fullname,
        },
      })

      return {
        email: prismaUser?.email!,
        emailVerified: null,
        id: prismaUser?.id,
        fullname: prismaUser?.fullname,
        avatar_url: prismaUser?.avatar_url!,
        username: prismaUser?.username,
      }
    },
    async deleteUser(userId) {},
    async linkAccount(account) {
      await prisma.account.create({
        data: {
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          type: account.type,
          access_token: account.access_token,
          expires_at: account.expires_at,
          user_id: account.userId,
          refresh_token: account.refresh_token,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        },
      })
    },
    async unlinkAccount({ providerAccountId, provider }) {},
    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: {
          expires,
          session_token: sessionToken,
          user_id: userId,
        },
      })

      return {
        sessionToken,
        userId,
        expires,
      }
    },
    async getSessionAndUser(sessionToken) {
      const prismaSession = await prisma.session.findUnique({
        where: {
          session_token: sessionToken,
        },
        include: { user: true },
      })

      if (!prismaSession) {
        return null
      }

      const { user, ...session } = prismaSession

      return {
        session: {
          expires: session.expires,
          sessionToken: session.session_token,
          userId: session.user_id,
        },
        user: {
          email: user?.email!,
          emailVerified: null,
          id: user?.id,
          fullname: user?.fullname,
          avatar_url: user?.avatar_url!,
          username: user?.username,
        },
      }
    },
    async updateSession({ sessionToken, expires, userId }) {
      const prismaSession = await prisma.session.update({
        where: { session_token: sessionToken },
        data: {
          expires,
          user_id: userId,
        },
      })

      return {
        sessionToken: prismaSession.session_token,
        userId: prismaSession.user_id,
        expires: prismaSession.expires,
      }
    },
    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: { session_token: sessionToken },
      })
    },
  }
}
