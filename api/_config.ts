import env from 'sugar-env'

console.log('telegram token', env.get('TELEGRAM_TOKEN', ''))

export const config = {
  telegram: {
    token: env.get('TELEGRAM_TOKEN', '')
  }
}

export type AppConfig = typeof config
