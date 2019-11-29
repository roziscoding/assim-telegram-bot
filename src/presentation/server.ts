import app from './app'
import ngrok from 'ngrok'
import { AppConfig } from '../app.config'

async function getWebhookExternalHost (config: AppConfig) {
  if (config.webhook.externalHost) return config.webhook.externalHost

  return ngrok.connect(config.webhook.bindingPort)
}

export async function start (config: AppConfig) {
  const bot = await app.factory(config)

  const externalHost = await getWebhookExternalHost(config)

  const { username } = await bot.telegram.getMe()

  await bot.telegram.setWebhook(`${externalHost}/${config.telegram.token}`)
  console.log(`Webhook set to ${externalHost}`)

  bot.startWebhook(`/${config.telegram.token}`, null, config.webhook.bindingPort, config.webhook.bindingHost)
  console.log(`Webhook listening on http://${config.webhook.bindingHost || 'localhost'}:${config.webhook.bindingPort}`)

  if (username) console.log(`Listening on username @${username}`)

  return bot
}

export default { start }
