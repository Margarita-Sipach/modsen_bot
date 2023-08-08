import { Scenes } from 'telegraf'
import { TelegrafContext } from '../../types';

export const helpScene = new Scenes.WizardScene('help', 
	(ctx: TelegrafContext) => {
		ctx.reply(ctx.i18n.t('commands'))
		return ctx.scene.leave();
	}
);
