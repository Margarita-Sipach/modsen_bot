import { Markup, Scenes } from 'telegraf'

export const placeScene = new Scenes.WizardScene('place', 
	(ctx: any) => {
		ctx.reply(ctx.i18n.t('place.city'))
		return ctx.wizard.next();
	},
	async(ctx: any) => {
		const {title, text, link, img} = await ctx.place.getNewElement(ctx.message.text);
		await ctx.replyWithPhoto({ url: img });
		await ctx.replyWithHTML(ctx.i18n.t('place.info', {title, text}), Markup.inlineKeyboard([
			[Markup.button.url(ctx.i18n.t('place.more'), link)],
		]))
		return ctx.scene.leave();
	}
);
