import { Scenes } from 'telegraf'
import { UserModel } from '../../models/User';
import { getChatId } from '../../util/functions';
import { TelegrafContext } from '../../types';
import { Weather } from '../../util/classes/weather';
import { Task } from '../../util/classes/task';
import { bot } from '../..';

export const startScene = new Scenes.WizardScene('start', 
	async(ctx: TelegrafContext) => {
		const chatId = getChatId(ctx);
		const isUserExist = await UserModel.findById(chatId);

		if(!isUserExist) {
			await UserModel.create({_id: chatId})
			bot.context.subs && (bot.context.subs[chatId] = {
				weather: new Weather(chatId),
				task: new Task(chatId),
			})
		}
	
		await ctx.reply(ctx.i18n.t('start.hello', {ctx}))
		return ctx.scene.leave();
	}
);
