import { Scenes } from 'telegraf'
import { TelegrafContext } from '../../types';
import { AnimalCommandsType } from '../../types/class';
import { WizardScene } from 'telegraf/typings/scenes';
import { getUserMessage } from '../../util/functions';

export const animalScene: WizardScene<TelegrafContext> = new Scenes.WizardScene('animal', 
	async(ctx) => {
		console.log('animal')
		const animalName = getUserMessage(ctx).slice(1)
		const {url, photographer} = await ctx[animalName as AnimalCommandsType].getNewElement();
		ctx.replyWithPhoto({url}, {caption: ctx.i18n.t("animal.author", {photographer})});
		return ctx.scene.leave();
	}
);
