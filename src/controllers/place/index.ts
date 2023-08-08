import { Markup, Scenes } from 'telegraf'
import { Place } from '../../util/classes/place';
import { back, createButton, sendError } from '../../util/functions';
import { checkCity } from '../../util/functions/check';
import { ValidationError } from '../../util/classes/err/validation';

export const placeScene = new Scenes.WizardScene('place', 
	(ctx: any) => {
		ctx.session.place = new Place()
		ctx.reply(ctx.i18n.t('place.city'))
		return ctx.wizard.next();
	},
	async(ctx: any) => {
		try{
			const city = await ctx.message.text;
			if(checkCity(city)) throw new ValidationError(ctx.i18n.t('error.city'))

			await ctx.session.place.setCoordinates(city);
			return ctx.wizard.steps[++ctx.wizard.cursor](ctx)
			
		}catch(e){
			throw new ValidationError(ctx.i18n.t('error.city'))
		}
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
		try{
			const buttonId = await ctx.callbackQuery?.data;
			if(!buttonId) throw new ValidationError(ctx.i18n.t('error.placeType'))
			await ctx.session.place.getAllElements(buttonId.replace('btn-', ''))

			const place = await ctx.session.place.getNewElement();
			const {title, text, link, img} = place;

			img && (await ctx.replyWithPhoto({ url: img }));
			await ctx.replyWithHTML(ctx.i18n.t('place.info', {title, text}), Markup.inlineKeyboard([
				[Markup.button.url(ctx.i18n.t('place.more'), link)],
			]));

		} catch(e){
			throw new ValidationError(ctx.i18n.t('error.placeType'))
		}
		return ctx.scene.leave();
	}
);
