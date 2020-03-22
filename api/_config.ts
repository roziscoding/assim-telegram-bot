import env from 'sugar-env'

export const config = {
  telegram: {
    token: env.get('TELEGRAM_TOKEN', '')
  }
}

export type AppConfig = typeof config