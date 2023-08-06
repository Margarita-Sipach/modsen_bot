import { Markup, Scenes } from 'telegraf'
import { User } from '../../models/User';
import { createButton, getChatId } from '../../util/functions';
import { Weather } from '../../util/classes/weather';

export const weatherScene = new Scenes.WizardScene('weather', 
	async(ctx: any) => {
		ctx.session.weather = new Weather()
		ctx.reply(ctx.i18n.t('weather.city'));
		return ctx.wizard.next();
	},
	async(ctx: any) => {
		const inputCity = await ctx.message.text;

		ctx.session.weather.city = inputCity;
		await ctx.session.weather.displayWeatherInfo(ctx);

		const user = await User.findById(getChatId(ctx));
		const noteButton = user!.weatherStatus
		? createButton(ctx, 'unfollow', 'weather', {city: user!.city}) 
		: createButton(ctx, 'follow', 'weather', {city: inputCity}) 

		await ctx.replyWithHTML(ctx.i18n.t('weather.followTitle'), Markup.inlineKeyboard([noteButton]));
		return ctx.wizard.next();
	},
	async(ctx: any) => {
		const buttonId = await ctx.callbackQuery?.data;

		switch (buttonId) {
			case 'btn-follow':
				await ctx.reply(ctx.i18n.t('weather.time'));
				return ctx.wizard.next();
			case 'btn-newCity': 
				ctx.scene.enter('weather');
				break;
			case 'btn-unfollow':
				await ctx.session.weather.unfollow(ctx);
				break;
		}

		return ctx.scene.leave();
	},
	async(ctx: any) => {
		await ctx.session.weather.follow(ctx);
		return ctx.scene.leave();
	}
);
