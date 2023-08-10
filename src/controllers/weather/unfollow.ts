import { Markup, Scenes } from 'telegraf'
import { checkTime } from '../../util/functions/check';
import { ValidationError } from '../../util/classes/err/validation';
import { TelegrafContext } from '../../types';

export const weatherUnfollowScene = new Scenes.WizardScene('weather-unfollow', 
	async(ctx: TelegrafContext) => {
		await ctx.session.weather.unfollow();
		await ctx.reply(ctx.i18n.t('weather.unfollowSuccess'))
		return ctx.scene.leave();
	}
);

