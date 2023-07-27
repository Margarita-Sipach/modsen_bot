import { Scenes } from 'telegraf'

export const helpScene = new Scenes.WizardScene('help', 
	(ctx: any) => {
		ctx.reply(ctx.i18n.t('commands'))
		return ctx.scene.leave();
	}
);
