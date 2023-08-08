import { Context, Markup, Scenes } from "telegraf";
import { TelegrafContext } from "../../types";
import { Message } from "telegraf/typings/core/types/typegram";

export const getChatId = (ctx: TelegrafContext) => ctx.message?.from.id || ctx.callbackQuery?.from.id;

export const createButton = (ctx: TelegrafContext, id: string, scene: string, params?: object) => Markup.button.callback(ctx.i18n.t(`${scene}.btn.${id}`, params), `btn-${id}`);

export const back = (ctx: TelegrafContext) => {
	return ctx.wizard.steps[--ctx.wizard.cursor](ctx)
}

export const sendError = (ctx: TelegrafContext, message: string) => {
	ctx.reply(message);
	return back(ctx)
}