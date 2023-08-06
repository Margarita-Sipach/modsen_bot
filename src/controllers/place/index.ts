import { Markup, Scenes } from 'telegraf'
import { Place } from '../../util/classes/place';
import { createButton } from '../../util/functions';
import { checkCity } from './middleware';

export const placeScene = new Scenes.WizardScene('place', 
	(ctx: any) => {
		ctx.session.place = new Place()
		ctx.reply(ctx.i18n.t('place.city'))
		return ctx.wizard.next();
	},
	async(ctx: any) => {
		const city = await ctx.message.text;
		await ctx.session.place.setCoordinates(city)

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

		await ctx.session.place.getAllElements(buttonId.replace('btn-', ''))
		const {title, text, link, img} = await ctx.session.place.getNewElement();

		img && (await ctx.replyWithPhoto({ url: img }));
		await ctx.replyWithHTML(ctx.i18n.t('place.info', {title, text}), Markup.inlineKeyboard([
			[Markup.button.url(ctx.i18n.t('place.more'), link)],
		]));
		return ctx.scene.leave();
	}
);
