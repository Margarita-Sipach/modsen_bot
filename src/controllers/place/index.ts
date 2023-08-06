import { Markup, Scenes } from 'telegraf'
import { Place } from '../../util/classes/place';
import { back, createButton, sendError } from '../../util/functions';
import { checkCity } from '../../util/functions/check';

export const placeScene = new Scenes.WizardScene('place', 
	(ctx: any) => {
		ctx.session.place = new Place()
		ctx.reply(ctx.i18n.t('place.city'))
		return ctx.wizard.next();
	},
	async(ctx: any) => {
		if(await checkCity(ctx)) return sendError(ctx, 'city')

		const city = await ctx.message.text;
		const coordinates = await ctx.session.place.setCoordinates(city);

		if((await coordinates) instanceof Error) return sendError(ctx, 'city')
		return ctx.wizard.steps[++ctx.wizard.cursor](ctx)
	},
	async(ctx: any) => {
		await ctx.replyWithHTML(ctx.i18n.t('place.type'), Markup.inlineKeyboard([
			[
				createButton(ctx, 'natural', 'place'),
				createButton(ctx, 'historic', 'place')
			],
			[
				createButton(ctx, 'cultural', 'place'),
				createButton(ctx, 'architecture', 'place')
			]
		]));
		return ctx.wizard.next();
	},
	async(ctx: any) => {

		const buttonId = await ctx.callbackQuery?.data;
		if(!buttonId) return sendError(ctx, 'placeType')
		if(await ctx.session.place.getAllElements(buttonId.replace('btn-', ''))) return sendError(ctx, 'badRequest')
		
		const place = await ctx.session.place.getNewElement();
		if(await place instanceof Error) return sendError(ctx, 'place')

		const {title, text, link, img} = place;

		img && (await ctx.replyWithPhoto({ url: img }));
		await ctx.replyWithHTML(ctx.i18n.t('place.info', {title, text}), Markup.inlineKeyboard([
			[Markup.button.url(ctx.i18n.t('place.more'), link)],
		]));
		return ctx.scene.leave();
	}
);
