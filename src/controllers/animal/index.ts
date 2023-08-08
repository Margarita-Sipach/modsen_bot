import { Scenes } from 'telegraf'
import { TelegrafContext } from '../../types';
import { AnimalCommandsType } from '../../types/class';

export const animalScene = new Scenes.WizardScene('animal', 
	async(ctx: TelegrafContext) => {
		try{
			const animalName = ctx.message.text.slice(1)
			const {url, photographer} = await ctx[animalName  as AnimalCommandsType].getNewElement();
			ctx.replyWithPhoto({url}, {caption: ctx.i18n.t("animal.author", {photographer})});
		} catch{
			ctx.reply('Что-то с сервером, попробуй позже')
		}
		return ctx.scene.leave();
	}
);
