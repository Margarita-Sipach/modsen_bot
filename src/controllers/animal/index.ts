import { Scenes } from 'telegraf'
import { TelegrafContext, AnimalCommandsType } from '@types';
import { WizardScene } from 'telegraf/typings/scenes';
import { getUserMessage } from '@fn';

export const animalScene: WizardScene<TelegrafContext> = new Scenes.WizardScene('animal', 
	async(ctx) => {
		console.log('animal')
		const animalName = getUserMessage(ctx).slice(1)
		const {url, photographer} = await ctx[animalName as AnimalCommandsType].getNewElement();
		ctx.replyWithPhoto({url}, {caption: ctx.i18n.t("animal.author", {photographer})});
		return ctx.scene.leave();
	}
);
