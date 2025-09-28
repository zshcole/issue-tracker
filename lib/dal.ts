// Current user
// export const getCurrentUser = cache(async () => {
//   const session = await getSession()
//   if (!session) return null

import { getSession } from "./auth"

//   // Skip database query during prerendering if we don't have a session
//   // hack until we have PPR https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering
//   if (
//     typeof window === 'undefined' &&
//     process.env.NEXT_PHASE === 'phase-production-build'
//   ) {
//     return null
//   }

//   await mockDelay(700)
//   try {
//     const result = await db
//       .select()
//       .from(users)
//       .where(eq(users.id, session.userId))

//     return result[0] || null
//   } catch (error) {
//     console.error('Error getting user by ID:', error)
//     return null
//   }
// })

export const getUserByEmail = async () => {
    const session = await getSession()
    if (!session) { 
        return null;
    }
}