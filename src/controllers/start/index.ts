import { Scenes } from 'telegraf'
import { User } from '../../models/User';
import { getChatId } from '../../util/functions';

export const startScene = new Scenes.WizardScene('start', 
	async(ctx: any) => {
		const chatId = getChatId(ctx);
		const isUserExist = await User.findById(chatId);
		if(!isUserExist) await User.create({_id: chatId, weatherStatus: false, city: ''})
		await ctx.reply(ctx.i18n.t('start.hello', {ctx}))
		return ctx.scene.leave();
	}
);
