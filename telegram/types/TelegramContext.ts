import { NowContext } from '..'
import { Update } from 'telegram-typings'

export type TelegramContext = NowContext & {
  update: Update
}
