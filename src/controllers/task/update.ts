import { Markup, Scenes } from 'telegraf'
import { getChatId } from '../../util/functions';
import { TelegrafContext } from '../../types';

export const taskUpdateScene = new Scenes.WizardScene('task-update', 
	async(ctx: TelegrafContext) => {
		await ctx.reply(ctx.i18n.t('task.update-number'));
		return ctx.wizard.next();
	},
	async(ctx: TelegrafContext) => {
		const id = getChatId(ctx);
		const task = (await ctx.session.task.getTasks(id))[+ctx.message.text - 1];

		await ctx.replyWithHTML(ctx.i18n.t('task.info', {title: task.title, body: task.body}), 
			Markup.inlineKeyboard([
				[
					Markup.button.callback(ctx.i18n.t('task.delete'), 'task-delete'),
					Markup.button.callback(ctx.i18n.t('task.complete'), 'task-complete'),
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
			case 'task-delete':
				await ctx.session.task.delete(userId);
				await ctx.reply(ctx.i18n.t('task.delete-success'));
				break;			
			case 'task-complete':
				await ctx.session.task.complete();
				await ctx.reply(ctx.i18n.t('task.complete-success'));
				break;		
		}
		
		await ctx.scene.enter('task');
	},
);
