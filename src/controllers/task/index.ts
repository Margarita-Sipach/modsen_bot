import { Markup, Scenes } from 'telegraf'
import { UserModel } from '../../models/User';
import { createButton, getChatId, strike } from '../../util/functions';
import { TaskModel } from './../../models/Task';
import { Task } from '../../util/classes/task';
import { TelegrafContext } from '../../types';
import { CallbackQuery } from 'telegraf/typings/core/types/typegram';

export const taskScene = new Scenes.WizardScene('task', 
	async(ctx: TelegrafContext) => {
		ctx.session.task = ctx.subs[getChatId(ctx)].task;
	
		const tasks = await ctx.session.task.getTasks();
		const tasksInfo = tasks.reduce((acc, item, index) => {
			const title = `${index + 1}. ${item.title}`;
			const body = item.body;
			const info = ctx.i18n.t('task.info', {title, body});
			return `${acc}\n${item.status ? strike(info) : info}`
		}, '') || ctx.i18n.t('task.empty');

		await ctx.replyWithHTML(ctx.i18n.t('task.list', {tasks: tasksInfo}), 
			Markup.inlineKeyboard([
				[createButton(ctx, 'add', 'task')],
				[createButton(ctx, 'update', 'task')]
			])
		);
		return ctx.wizard.next();
	},
	async(ctx: TelegrafContext) => {
		const buttonId = await ctx.callbackQuery?.data;

		switch (buttonId) {
			case 'btn-add':
				ctx.scene.enter('task-add');
				break;
			case 'btn-update': 
				ctx.scene.enter('task-update');
				break;
		}
		return ctx.scene.leave();
	},
);
