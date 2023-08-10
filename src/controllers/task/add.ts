import { Markup, Scenes } from 'telegraf'
import { checkTime } from '../../util/functions/check';
import { ValidationError } from '../../util/classes/err/validation';
import { TelegrafContext } from '../../types';
import { createButton } from '../../util/functions';

export const taskAddScene = new Scenes.WizardScene('task-add', 
	async(ctx: TelegrafContext) => {
		await ctx.reply(ctx.i18n.t('task.add-title'));
		return ctx.wizard.next();
	},
	async(ctx: TelegrafContext) => {
		if(!ctx.message.text) throw new ValidationError(ctx.i18n.t('error.empty'))
		ctx.session.task.title = ctx.message.text;
		await ctx.reply(ctx.i18n.t('task.add-body'));
		return ctx.wizard.next();
	},
	async(ctx: TelegrafContext) => {
		if(!ctx.message.text) throw new ValidationError(ctx.i18n.t('error.empty'))
		ctx.session.task.body = ctx.message.text;
		await ctx.replyWithHTML(ctx.i18n.t('task.time'), 
			Markup.inlineKeyboard([[
				createButton(ctx, 'yes', 'task'), 
				createButton(ctx, 'no', 'task')
			]])
		);
		return ctx.wizard.next();
	},
	async(ctx: TelegrafContext) => {
		const buttonId = await ctx.callbackQuery?.data;

		switch (buttonId) {
			case 'btn-yes':
				ctx.reply(ctx.i18n.t('task.add-time'))
				break;
			case 'btn-no': 
				await ctx.session.task.add(ctx);
				ctx.scene.enter('task');
				break;
		}
	},
	async(ctx: TelegrafContext) => {
		const time = ctx.message.text;
		if(checkTime(time)) throw new ValidationError(ctx.i18n.t('error.time'))
		ctx.session.task.time = time;
		await ctx.session.task.add(ctx);
		await ctx.scene.enter('task');
	},
);