import { Scenes } from 'telegraf'
import { checkTime } from '../../util/functions/check';
import { ValidationError } from '../../util/classes/err/validation';
import { TelegrafContext } from '../../types';
import { getUserMessage, sendText } from '../../util/functions';
import { WizardScene } from 'telegraf/typings/scenes';

export const weatherFollowScene: WizardScene<TelegrafContext> = new Scenes.WizardScene('weather-follow', 
	async(ctx) => {
		await sendText(ctx, 'weather.time');
		return ctx.wizard.next();
	},
	async(ctx) => {
		const time = getUserMessage(ctx)
		if(checkTime(time)) throw new ValidationError(ctx.i18n.t('error.time'))
		await ctx.session.weather.follow(time);
		await sendText(ctx, 'weather.followSuccess');
		return ctx.scene.leave();
	}
);