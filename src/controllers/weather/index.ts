import { Markup, Scenes } from 'telegraf'

export const weatherScene = new Scenes.WizardScene('weather', 
	(ctx: any) => {
		ctx.reply(ctx.i18n.t('weather.city'));
		return ctx.wizard.next();
	},
	async(ctx: any) => {
		const weatherInfo = await ctx.weather.getCityWeather(ctx.message.text)
		await ctx.replyWithHTML(ctx.i18n.t('weather.info', {...weatherInfo, city: ctx.weather.city}));
		return ctx.scene.leave();
	},

);
