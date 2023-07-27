import { Scenes } from 'telegraf'

export const catScene = new Scenes.WizardScene('cat', 
	async(ctx: any) => {
		const {url, photographer} = await ctx.cat.getNewElement();
		ctx.replyWithPhoto({url}, {caption: ctx.i18n.t("animal.author", {photographer})});
		return ctx.scene.leave();
	}
);

export const dogScene = new Scenes.WizardScene('dog', 
	async(ctx: any) => {
		const {url, photographer} = await ctx.dog.getNewElement();
		ctx.replyWithPhoto({url}, {caption: ctx.i18n.t("animal.author", {photographer})});
		return ctx.scene.leave();
	}
);
