import { Markup, Scenes } from 'telegraf'
import { UserModel } from '../../models/User';
import { createButton, getChatId, sendError } from '../../util/functions';
import { Weather } from '../../util/classes/weather';
import { checkCity, checkTime } from '../../util/functions/check';
import { time } from 'console';
import { ValidationError } from '../../util/classes/err/validation';

export const weatherFollowScene = new Scenes.WizardScene('weather-follow', 
	async(ctx: any) => {
		await ctx.reply(ctx.i18n.t('weather.time'));
		return ctx.wizard.next();
	},
	async(ctx: any) => {
		const time = await ctx.message.text;
		if(checkTime(time)) throw new ValidationError(ctx.i18n.t('error.time'))
		await ctx.session.weather.follow(ctx);
		return ctx.scene.leave();
	}
);

