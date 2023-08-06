import { Markup } from "telegraf";

export const getChatId = (ctx: any) => ctx.message?.from.id || ctx.callbackQuery?.from.id;

export const createButton = (ctx: any, id: string, scene: string, params?: object) => Markup.button.callback(ctx.i18n.t(`${scene}.btn.${id}`, params), `btn-${id}`);

export const back = (ctx: any) => ctx.wizard.steps[--ctx.wizard.cursor](ctx)

export const sendError = async(ctx: any, errorName: string) => {
	await ctx.reply(ctx.i18n.t(`error.${errorName}`))
	return back(ctx)
}