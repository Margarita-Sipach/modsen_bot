import { Markup, Scenes } from 'telegraf'
import { User } from '../../models/User';
import { getChatId } from '../../util/functions';
import { TaskModel } from './../../models/Task';

export const taskScene = new Scenes.WizardScene('task', 
	async(ctx: any) => {
		const chatId = getChatId(ctx);
		const userIds = (await User.findById(chatId))!.tasks;
		const tasks = await TaskModel.find({ '_id': { $in: userIds } });
		
		const tasksInfo = tasks.reduce((acc, item, index) => {
			const title = `${index + 1}. ${item.title}`;
			const body = item.body;
			const info = ctx.i18n.t('task.info', {title, body});
			return `${acc}\n${item.status ? `<s>${info}</s>` : info}`
		}, '');

		await ctx.replyWithHTML(ctx.i18n.t('task.title', {tasks: tasksInfo}), 
			Markup.inlineKeyboard([
				[Markup.button.callback(ctx.i18n.t('task.add'), 'task-add')],
				[Markup.button.callback(ctx.i18n.t('task.update'), 'task-update')],
				[Markup.button.callback(ctx.i18n.t('task.close'), 'task-close')]
			])
		);
		return ctx.wizard.next();
	},
	async(ctx: any) => {
		const buttonId = await ctx.callbackQuery?.data;

		switch (buttonId) {
			case 'task-add':
				ctx.scene.enter('task-add');
				break;
			case 'task-update': 
				ctx.scene.enter('task-update');
				break;
		}
		return ctx.scene.leave();
	},
);
