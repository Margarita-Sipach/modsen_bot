import { Markup, Scenes } from 'telegraf'
import { User } from '../../models/User';
import { getChatId } from '../../util/functions';

export const weatherScene = new Scenes.WizardScene('weather', 
	async(ctx: any) => {
		ctx.reply(ctx.i18n.t('weather.city'));
		console.log(1111111)
		return ctx.wizard.next();
	},
	async(ctx: any) => {
		const inputCity = await ctx.message.text;
		console.log(await ctx.message.text)

		ctx.weather.city = inputCity;
		console.log(inputCity)
		await ctx.weather.displayWeatherInfo(ctx);

		const user = await User.findById(getChatId(ctx));
		const noteButton = user!.weatherStatus
		? Markup.button.callback(ctx.i18n.t('weather.unfollow', {city: user!.city}), 'weather-unfollow') 
		: Markup.button.callback(ctx.i18n.t('weather.follow', {city: inputCity}), 'weather-follow') ;

		await ctx.replyWithHTML(ctx.i18n.t('weather.followTitle'), Markup.inlineKeyboard([noteButton]));
		return ctx.wizard.next();
	},
	async(ctx: any) => {
		const buttonId = await ctx.callbackQuery?.data;

		switch (buttonId) {
			case 'weather-follow':
				await ctx.reply(ctx.i18n.t('weather.time'));
				return ctx.wizard.next();
			case 'weather-city': 
				ctx.scene.enter('weather');
				break;
			case 'weather-unfollow':
				await ctx.weather.unfollow(ctx);
				break;
		}

		return ctx.scene.leave();
	},
	async(ctx: any) => {
		await ctx.weather.follow(ctx);
		return ctx.scene.leave();
	}
);
