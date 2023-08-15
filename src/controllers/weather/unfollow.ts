import { Scenes } from 'telegraf'
import { TelegrafContext } from '@types';
import { sendText } from '@fn';
import { WizardScene } from 'telegraf/typings/scenes';

export const weatherUnfollowScene: WizardScene<TelegrafContext> = new Scenes.WizardScene('weather-unfollow', 
	async(ctx) => {
		await ctx.session.weather.unfollow();
		await sendText(ctx, 'weather.unfollowSuccess');
		return ctx.scene.leave();
	}
);

