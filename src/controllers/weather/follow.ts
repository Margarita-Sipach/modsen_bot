import { Markup, Scenes } from 'telegraf'
import { checkTime } from '../../util/functions/check';
import { ValidationError } from '../../util/classes/err/validation';
import { TelegrafContext } from '../../types';

export const weatherFollowScene = new Scenes.WizardScene('weather-follow', 
	async(ctx: TelegrafContext) => {
		await ctx.reply(ctx.i18n.t('weather.time'));
		return ctx.wizard.next();
	},
	async(ctx: TelegrafContext) => {
		const time = ctx.message.text;
		if(checkTime(time)) throw new ValidationError(ctx.i18n.t('error.time'))
		await ctx.session.weather.follow(time);
		await ctx.reply(ctx.i18n.t('weather.followSuccess'))
		return ctx.scene.leave();
	}
);

