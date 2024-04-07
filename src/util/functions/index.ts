import { Markup } from 'telegraf';
import { TelegrafContext } from '@types';
import { Message } from 'telegraf/typings/core/types/typegram';

export const getChatId = (ctx: TelegrafContext) =>
  ctx.message?.from.id || ctx.callbackQuery?.from.id;

export const createButton = (
  ctx: TelegrafContext,
  id: string,
  params?: object,
) =>
  Markup.button.callback(
    ctx.i18n.t(`${ctx.scene.current?.id.split('-')[0]}.btn.${id}`, params),
    `btn-${id}`,
  );

export const capitalize = (str: string) => {
  const [firstLetter, ...rest] = str;
  return `${firstLetter.toUpperCase()}${rest.join('').toLowerCase()}`;
};

export const strike = (str: string) => `<s>${str}</s>`;

export const sendText = (ctx: TelegrafContext, name: string, params?: object) =>
  ctx.reply(ctx.i18n.t(`${name}`, params));

export const sendCommandText = (
  ctx: TelegrafContext,
  name?: string,
  params?: object,
) =>
  sendText(
    ctx,
    `${ctx.scene.current?.id.split('-')[0]}${name ? `.${name}` : ''}`,
    params,
  );

export const getUserMessage = (ctx: TelegrafContext): string =>
  (ctx.message as Message.TextMessage)?.text;
