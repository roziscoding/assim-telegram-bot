import env from 'sugar-env'

export const config = {
  telegram: {
    token: env.get('TELEGRAM_TOKEN', '')
  },
  webhook: {
    bindingHost: env.get('WEBHOOK_BINDING_HOST', '0.0.0.0'),
    bindingPort: env.get.int(['WEBHOOK_BINDING_PORT', 'PORT'], 3000),
    externalHost: env.get('WEBHOOK_EXTERNAL_HOST', '')
  }
}

export type AppConfig = typeof config