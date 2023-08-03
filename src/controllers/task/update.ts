import { Markup, Scenes } from 'telegraf'
import { getChatId } from '../../util/functions';

export const taskUpdateScene = new Scenes.WizardScene('task-update', 
	async(ctx: any) => {
		await ctx.reply(ctx.i18n.t('task.update-number'));
		return ctx.wizard.next();
	},
	async(ctx: any) => {
		const id = getChatId(ctx);
		const task = (await ctx.task.getTasks(id))[ctx.message.text - 1];
		console.log(task)

		await ctx.replyWithHTML(ctx.i18n.t('task.info', {title: task.title, body: task.body}), 
			Markup.inlineKeyboard([
				[
					Markup.button.callback(ctx.i18n.t('task.delete'), 'task-delete'),
					Markup.button.callback(ctx.i18n.t('task.complete'), 'task-complete'),
				],
				[Markup.button.callback(ctx.i18n.t('task.back'), 'task-back')]
			])
		);
		ctx.task.id = task._id;
		return ctx.wizard.next();
	},
	async(ctx: any) => {
		const buttonId = await ctx.callbackQuery?.data;
		const userId = getChatId(ctx)

		switch (buttonId) {
			case 'task-delete':
				await ctx.task.delete(userId);
				await ctx.reply(ctx.i18n.t('task.delete-success'));
				await ctx.scene.enter('task');
				break;			
			case 'task-complete':
				await ctx.task.complete(userId);
				await ctx.reply(ctx.i18n.t('task.complete-success'));
				await ctx.scene.enter('task');
				break;		
			// case 'task-update': 
			// 	ctx.scene.enter('task-update');
			// 	break;
			// case 'weather-unfollow':
			// 	await ctx.weather.unfollow(ctx);
			// 	break;
		}
		return ctx.scene.leave();
	},
);
