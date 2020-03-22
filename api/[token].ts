import { config } from './_config'
import { inliqueryHandler } from '../handlers/transform'
import { NowRequest, NowResponse } from '@now/node'
import { InvalidTokenError } from '../telegram/errors/InvalidTokenError'
import { getUpdateHandler, getAuthenticatedContext } from '../telegram'

export default (req: NowRequest, res: NowResponse) => {
  const handleUpdate = getUpdateHandler({
    inlineQuery: inliqueryHandler
  })

  getAuthenticatedContext(config.telegram.token, req, res)
    .then(handleUpdate)
    .catch(err => {
      if (err.response) console.error(err.response.body)
      if (err instanceof InvalidTokenError) return res.status(401).end()

      if (!res.headersSent) res.status(500).json({ status: 500, error: { message: err.message, code: 'internal_server_error', stack: err.stack, body: err.response?.body } })
    })
}
