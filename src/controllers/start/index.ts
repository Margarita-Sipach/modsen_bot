import { Scenes } from 'telegraf'
import { UserModel } from '../../models/User';
import { getChatId, sendCommandText } from '../../util/functions';
import { TelegrafContext } from '../../types';
import { Weather } from '../../util/classes/weather';
import { Task } from '../../util/classes/task';
import { bot } from '../..';
import { WizardScene } from 'telegraf/typings/scenes';

export const startScene: WizardScene<TelegrafContext> = new Scenes.WizardScene('start', 
	async(ctx) => {
		console.log('start')
		const chatId = getChatId(ctx);

		if(!chatId) return;
		const isUserExist = await UserModel.findById(chatId);

		if(!isUserExist) {
			await UserModel.create({_id: chatId})
			bot.context.subs && (bot.context.subs[chatId] = {
				weather: new Weather(chatId),
				task: new Task(chatId),
			})
		}

		await sendCommandText(ctx, 'hello', {ctx});
		return ctx.scene.leave();
	}
);
