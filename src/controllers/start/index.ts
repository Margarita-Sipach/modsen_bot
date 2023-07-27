import { Scenes } from 'telegraf'

export const startScene = new Scenes.WizardScene('start', 
	(ctx: any) => {
		ctx.reply(ctx.i18n.t('start.hello', {ctx}))
		return ctx.scene.leave();
	}
);
