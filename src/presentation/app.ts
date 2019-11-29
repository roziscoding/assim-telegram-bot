import Telegraf from 'telegraf'
import { AppConfig } from '../app.config'
import { getResults } from '../lib/transform'

export function factory (config: AppConfig) {
  const bot = new Telegraf(config.telegram.token, { telegram: { webhookReply: false } })

  bot.on('inline_query', ctx => {
    ctx.answerInlineQuery(getResults(ctx.inlineQuery?.query))
      .catch(() => { })
  })

  return bot
}

export default { factory }