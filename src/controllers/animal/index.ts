import { Scenes } from 'telegraf'

export const animalScene = new Scenes.WizardScene('animal', 
	async(ctx: any) => {
		try{
			const animalName = (await ctx.message.text).slice(1)
			const {url, photographer} = await ctx[animalName].getNewElement();
			ctx.replyWithPhoto({url}, {caption: ctx.i18n.t("animal.author", {photographer})});
		} catch{
			ctx.reply('Что-то с сервером, попробуй позже')
		}
		return ctx.scene.leave();
	}
);
