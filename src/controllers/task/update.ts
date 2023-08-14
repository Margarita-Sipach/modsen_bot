import { Markup, Scenes } from 'telegraf'
import { createButton, getChatId, getUserMessage, sendCommandText, sendText, strike } from '../../util/functions';
import { TelegrafContext } from '../../types';
import { WizardScene } from 'telegraf/typings/scenes';

export const taskUpdateScene: WizardScene<TelegrafContext> = new Scenes.WizardScene('task-update', 
	async(ctx) => {
		sendText(ctx, 'task.update-number');
		return ctx.wizard.next();
	},
	async(ctx) => {
		const task = (await ctx.session.task.getTasks())[+getUserMessage(ctx) - 1];

		const taskInfo = {
			title: task.title,
			body: task.body
		}

		const completeButton = task.status
			?	createButton(ctx, 'incomplete')
			: createButton(ctx, 'complete')

		await ctx.replyWithHTML(
			task.status 
				? strike(ctx.i18n.t('task.info', taskInfo)) 
				: ctx.i18n.t('task.info', taskInfo), 
			Markup.inlineKeyboard([
				[
					completeButton,
					createButton(ctx, 'delete')
				],
				[Markup.button.callback(ctx.i18n.t('task.back'), 'task-back')]
			])
		);
		ctx.session.task.id = task._id.toString();
		return ctx.wizard.next();
	},
	async(ctx) => {
		const buttonId = ctx.callbackQuery?.data;
		const userId = getChatId(ctx)
		if(!userId) return ctx.scene.leave()

		switch (buttonId) {
			case 'btn-delete':
				await ctx.session.task.delete(userId);
				await sendCommandText(ctx, 'delete-success');
				break;			
			case 'btn-complete':
				await ctx.session.task.complete();
				await sendCommandText(ctx, 'complete-success');
				break;	
			case 'btn-incomplete':
				await ctx.session.task.incomplete();
				await sendCommandText(ctx, 'incomplete-success');
				break;		
		}
		
		return ctx.scene.leave()
	},
);
