import { Markup, Scenes } from 'telegraf'
import { capitalize, createButton, getChatId, getUserMessage, sendCommandText } from '../../util/functions';
import { checkCity } from '../../util/functions/check';
import { ValidationError } from '../../util/classes/err/validation';
import { TelegrafContext } from '../../types';
import { WizardScene } from 'telegraf/typings/scenes';

export const weatherScene: WizardScene<TelegrafContext> = new Scenes.WizardScene('weather', 
	async(ctx) => {
		console.log('weather')
		const chatId = getChatId(ctx);
		if(!chatId) return ctx.scene.leave()
		
		ctx.session.weather = ctx.subs[chatId].weather;
		await sendCommandText(ctx, 'city');
		return ctx.wizard.next();
	},
	async(ctx) => {
		try{
			const inputCity = ctx.session.weather.changeCity = capitalize(getUserMessage(ctx));
			if(checkCity(inputCity)) throw new ValidationError(ctx.i18n.t('error.city'))

			const weatherInfo = await ctx.session.weather.getWeatherInfo();

			await ctx.replyWithHTML(
				ctx.i18n.t('weather.info', weatherInfo), 
				Markup.inlineKeyboard([createButton(ctx, 'newCity')])
			);

			const noteButton = ctx.session.weather.status
				? createButton(ctx, 'unfollow', {city: ctx.session.weather.city}) 
				: createButton(ctx, 'follow', {city: inputCity}) 

			await ctx.replyWithHTML(ctx.i18n.t('weather.followTitle'), Markup.inlineKeyboard([noteButton]));
			return ctx.wizard.next();

		}catch{
			throw new ValidationError(ctx.i18n.t('error.city'))
		}
	},
	async(ctx) => {
		const buttonId = await ctx.callbackQuery?.data;

		switch (buttonId) {
			case 'btn-follow':
				ctx.scene.enter('weather-follow');
				break
			case 'btn-newCity': 
				ctx.scene.enter('weather');
				break;
			case 'btn-unfollow':
				ctx.scene.enter('weather-unfollow');
				break;
		}

		return ctx.scene.leave();
	}
);
