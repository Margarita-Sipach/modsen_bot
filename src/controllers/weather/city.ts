import { Markup, Scenes } from 'telegraf'
import { capitalize, createButton, getUserMessage, sendCommandText } from '@fn';
import { checkCity } from '@check';
import { ValidationError } from '@err';
import { TelegrafContext } from '@types';
import { WizardScene } from 'telegraf/typings/scenes';

export const weatherCityScene: WizardScene<TelegrafContext> = new Scenes.WizardScene('weather-city', 
	async(ctx) => {
		await sendCommandText(ctx, 'city');
		return ctx.wizard.next();
	},
	async(ctx) => {
		try{
			const inputCity = ctx.session.weather.changeCity = capitalize(getUserMessage(ctx));
			if(checkCity(inputCity)) throw new ValidationError(ctx.i18n.t('error.city'))

			const weatherInfo = await ctx.session.weather.getWeatherInfo();

			await ctx.replyWithHTML(
				ctx.i18n.t('weather.info', weatherInfo)
			);

			const noteButton = !ctx.session.weather.status && [createButton(ctx, 'follow', {city: inputCity})];
			if(!noteButton) return ctx.scene.leave();

			noteButton && (await ctx.replyWithHTML(ctx.i18n.t('weather.followTitle'), Markup.inlineKeyboard([noteButton])));
			return ctx.wizard.next();

		}catch{
			throw new ValidationError(ctx.i18n.t('error.city'))
		}
	},
	async(ctx) => {
		const buttonId = ctx.callbackQuery?.data;
		if(buttonId === 'btn-follow') ctx.scene.enter('weather-follow');
		return ctx.scene.leave();
	},
);
