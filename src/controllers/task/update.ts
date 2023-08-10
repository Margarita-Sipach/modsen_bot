import { Markup, Scenes } from 'telegraf'
import { createButton, getChatId, strike } from '../../util/functions';
import { TelegrafContext } from '../../types';

export const taskUpdateScene = new Scenes.WizardScene('task-update', 
	async(ctx: TelegrafContext) => {
		await ctx.reply(ctx.i18n.t('task.update-number'));
		return ctx.wizard.next();
	},
	async(ctx: TelegrafContext) => {
		const task = (await ctx.session.task.getTasks())[+ctx.message.text - 1];

		const taskInfo = {
			title: task.title,
			body: task.body
		}

		const completeButton = task.status
			?	createButton(ctx, 'incomplete', 'task')
			: createButton(ctx, 'complete', 'task')

		await ctx.replyWithHTML(
			task.status 
				? strike(ctx.i18n.t('task.info', taskInfo)) 
				: ctx.i18n.t('task.info', taskInfo), 
			Markup.inlineKeyboard([
				[
					completeButton,
					createButton(ctx, 'delete', 'task')
				],
				[Markup.button.callback(ctx.i18n.t('task.back'), 'task-back')]
			])
		);
		ctx.session.task.id = task._id.toString();
		return ctx.wizard.next();
	},
	async(ctx: TelegrafContext) => {
		const buttonId = await ctx.callbackQuery?.data;
		const userId = getChatId(ctx)

		switch (buttonId) {
			case 'btn-delete':
				await ctx.session.task.delete(userId);
				await ctx.reply(ctx.i18n.t('task.delete-success'));
				break;			
			case 'btn-complete':
				await ctx.session.task.complete();
				await ctx.reply(ctx.i18n.t('task.complete-success'));
				break;	
			case 'btn-incomplete':
				await ctx.session.task.incomplete();
				await ctx.reply(ctx.i18n.t('task.incomplete-success'));
				break;		
		}
		
		await ctx.scene.enter('task');
	},
);
