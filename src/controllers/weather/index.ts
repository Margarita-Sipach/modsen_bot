import { Markup, Scenes } from 'telegraf'
import { UserModel } from '../../models/User';
import { capitalize, createButton, getChatId } from '../../util/functions';
import { Weather } from '../../util/classes/weather';
import { checkCity } from '../../util/functions/check';
import { ValidationError } from '../../util/classes/err/validation';
import { TelegrafContext } from '../../types';

export const weatherScene = new Scenes.WizardScene('weather', 
	async(ctx: TelegrafContext) => {
		ctx.session.weather = ctx.subs[getChatId(ctx)].weather;
		ctx.reply(ctx.i18n.t('weather.city'));
		return ctx.wizard.next();
	},
	async(ctx: TelegrafContext) => {
		try{
			const inputCity = ctx.session.weather.changeCity = capitalize(ctx.message.text);
			if(checkCity(inputCity)) throw new ValidationError(ctx.i18n.t('error.city'))

			const weatherInfo = await ctx.session.weather.getWeatherInfo();

			await ctx.replyWithHTML(
				ctx.i18n.t('weather.info', weatherInfo), 
				Markup.inlineKeyboard([createButton(ctx, 'newCity', 'weather')])
			);

			const noteButton = ctx.session.weather.status
				? createButton(ctx, 'unfollow', 'weather', {city: ctx.session.weather.city}) 
				: createButton(ctx, 'follow', 'weather', {city: inputCity}) 

			await ctx.replyWithHTML(ctx.i18n.t('weather.followTitle'), Markup.inlineKeyboard([noteButton]));
			return ctx.wizard.next();

		}catch{
			throw new ValidationError(ctx.i18n.t('error.city'))
		}
	},
	async(ctx: TelegrafContext) => {
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
