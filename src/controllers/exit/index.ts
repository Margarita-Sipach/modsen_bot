import { Scenes } from 'telegraf'
import { TelegrafContext, AnimalCommandsType } from '@types';
import { WizardScene } from 'telegraf/typings/scenes';
import { getUserMessage, sendCommandText } from '@fn';

export const exitScene: WizardScene<TelegrafContext> = new Scenes.WizardScene('exit', 
	async(ctx) => {
		console.log('exit')
		sendCommandText(ctx)
		return ctx.scene.leave();
	}
);
