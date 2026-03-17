import { jwtVerify, SignJWT } from 'jose'

async function test() {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  console.log('Secret encoded:', secret)
}
test()
