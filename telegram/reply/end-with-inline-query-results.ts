import got from 'got'
import logdown from 'logdown'
import { InlineQueryResult } from 'telegram-typings'
import { TelegramContext } from '../types/TelegramContext'
import { RequireSpecific } from '../types/RequireSpecific'

const logger = logdown('telegram:end-with-inline-query-results')

export type AnswerInlineQueryConfig = {
  cacheTime: number
  isPersonal: boolean
  nextOffset: string,
  token:  string
}

const mapConfig = (config: Partial<AnswerInlineQueryConfig>) => ({
  cache_time: config.cacheTime,
  is_personal: config.isPersonal,
  next_offset: config.nextOffset
})

export async function endWithInlineQueryResults (results: InlineQueryResult[], context: TelegramContext, config: RequireSpecific<Partial<AnswerInlineQueryConfig>, 'token'>) {
  if (!context.update.inline_query) throw new Error('the provided context does not contain an inline query')

  const query = context.update.inline_query

  const payload = {
    method: 'answerInlineQuery',
    inline_query_id: query.id,
    results: JSON.stringify(results),
    ...mapConfig(config)
  }

  const url = `https://api.telegram.org/bot${config.token}/answerInlineQuery`

  logger.debug(`Sending results to ${url}`)

  await got(url, {
    searchParams: new URLSearchParams(payload as any),
    responseType: 'json',
    retry: 0
  })
    .catch(err => {
      context.res.end()
      throw err
    })

  logger.debug('Results sent')

  if (!context.res.headersSent) context.res.status(200)
    .end()
}
