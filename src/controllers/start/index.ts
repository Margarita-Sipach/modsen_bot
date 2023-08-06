import { Scenes } from 'telegraf'
import { UserModel } from '../../models/User';
import { getChatId } from '../../util/functions';

export const startScene = new Scenes.WizardScene('start', 
	async(ctx: any) => {
		const chatId = getChatId(ctx);
		const isUserExist = await UserModel.findById(chatId);
		if(!isUserExist) await UserModel.create({_id: chatId, weatherStatus: false, tasks: []})
		await ctx.reply(ctx.i18n.t('start.hello', {ctx}))
		return ctx.scene.leave();
	}
);
