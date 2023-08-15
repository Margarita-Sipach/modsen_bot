import { Markup, Scenes } from 'telegraf'
import { createButton, getChatId, getUserMessage, sendCommandText, sendText, strike } from '@fn';
import { TelegrafContext } from '@types';
import { WizardScene } from 'telegraf/typings/scenes';
import { ValidationError } from '@err';
import { checkExit, checkNumber } from '@check';

export const taskUpdateScene: WizardScene<TelegrafContext> = new Scenes.WizardScene('task-update', 
	async(ctx) => {
		sendText(ctx, 'task.update-number');
		return ctx.wizard.next();
	},
	async(ctx) => {
		if(checkExit(ctx)) return ctx.scene.enter('exit')
		const allTasks = await ctx.session.task.getTasks();
		const taskNumber = +getUserMessage(ctx) - 1;

		if(checkNumber(taskNumber, allTasks.length)) throw new ValidationError(ctx.i18n.t('error.number'))
		
		const task = allTasks[taskNumber];

		const taskInfo = {
			title: task.title,
			body: task.body,
			time: task.time
		}

		const completeButton = task.status
			?	createButton(ctx, 'incomplete')
			: createButton(ctx, 'complete')

			const taskHTML = task.status 
			? strike(ctx.i18n.t('task.info', taskInfo)) 
			: ctx.i18n.t('task.info', taskInfo)
			
		await ctx.replyWithHTML(taskHTML, 
			Markup.inlineKeyboard([
				[
					completeButton,
					createButton(ctx, 'delete')
				]
			])
		);
		ctx.session.task.id = task._id.toString();
		return ctx.wizard.next();
	},
	async(ctx) => {
		if(checkExit(ctx)) return ctx.scene.enter('exit')
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
