import { NowContext } from '..'
import { InvalidTokenError } from '../errors/InvalidTokenError'

export async function authenticate (token: string, { req, res }: NowContext) {
  if (!token) {
    throw new Error('No token present')
  }

  if (token !== req.query.token) {
    res.status(401).end()
    throw new InvalidTokenError()
  }

  return { req, res }
}
