import uuid from 'uuid/v4'
import logdown from 'logdown'
import { InlineQuery, InlineQueryResultArticle } from 'telegram-typings'
import { TelegramContext } from '../telegram/types/TelegramContext'
import { endWithInlineQueryResults } from '../telegram/reply/end-with-inline-query-results'

const logger = logdown('assim-telegram-bot:inline-query')

function transform (query: string) {
  return `\`${query.split('').join(' ')}\``
}

function hasPre (query: string) {
  return /.*`.*`.*/ig.test(query)
}

function extractPre (query: string) {
  const match = /(?<before>.*)`(?<pre>.+)`(?<after>.*)/ig.exec(query)
  const pre = match?.groups?.pre
  const before = match?.groups?.before ?? ''
  const after = match?.groups?.after ?? ''

  const cleanPre = pre ? pre.replace(/`/ig, '') : pre

  return { before, pre: cleanPre, after }
}

function getMixed (query: string) {
  return transform(query)
}

function getAllLower (query: string) {
  return transform(query.toLowerCase())
}

function getAllUpper (query: string) {
  return transform(query.toUpperCase())
}

function getPreMixed (query: string) {
  const { before, pre, after } = extractPre(query)

  if (!pre) return ''

  return `${before}${transform(pre)}${after}`
}

function getPreAllLower (query: string) {
  const { before, pre, after } = extractPre(query)

  if (!pre) return ''

  return `${before}${transform(pre)}${after}`
}

function getPreAllUpper (query: string) {
  const { before, pre, after } = extractPre(query)

  if (!pre) return ''

  return `${before}${transform(pre.toUpperCase())}${after}`
}

function getPreResults (query: string) {
  return [
    [ getPreMixed(query), 'getPreMixed', 'Normal' ],
    [ getPreAllLower(query), 'getPreAllLower', 'Tudo minúsculo' ],
    [ getPreAllUpper(query), 'getPreAllUpper', 'Tudo maiúsculo' ]
  ]
}

function getNonPreResults (query: string) {
  return [
    [ getMixed(query), 'getMixed', 'Normal' ],
    [ getAllLower(query), 'getAllLower', 'Tudo minúsculo' ],
    [ getAllUpper(query), 'getAllUpper', 'Tudo maiúsculo' ],
  ]
}

export function getResults (query: string): InlineQueryResultArticle[] {
  const results = hasPre(query)
    ? getPreResults(query)
    : getNonPreResults(query)

  return results.map(([ result, name, title ]) => {
    return {
      id: `${uuid()}-${name}`,
      type: 'article',
      input_message_content: { message_text: result, parse_mode: 'Markdown' },
      title,
      description: result
    }
  })
}

export const inliqueryHandler = (token: string) => async (query: InlineQuery, context: TelegramContext) => {
  logger.debug('Received inline query', query)

  if (!query.query) {
    logger.debug('Aborting due to empty query')
    return context.res.end()
  }

  const results = getResults(query.query)

  return endWithInlineQueryResults(results, context, { cacheTime: 0, isPersonal: false, token })
}
