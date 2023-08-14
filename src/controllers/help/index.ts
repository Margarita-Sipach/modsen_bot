import { Scenes } from 'telegraf'
import { TelegrafContext } from '../../types';
import { sendCommandText, sendText } from '../../util/functions';
import { WizardScene } from 'telegraf/typings/scenes';

export const helpScene: WizardScene<TelegrafContext> = new Scenes.WizardScene('help', 
	(ctx) => {
		sendText(ctx, 'commands');
		return ctx.scene.leave();
	}
);
