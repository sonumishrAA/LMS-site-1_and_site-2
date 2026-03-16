import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export function verifyCrossSiteToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      owner_id: string
      owner_email: string
      library_id?: string
      purpose: 'renew' | 'add-library'
    }
  } catch {
    return null
  }
}
