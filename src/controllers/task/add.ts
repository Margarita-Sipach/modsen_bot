import { Markup, Scenes } from 'telegraf'
import { checkExit, checkTime } from '@check';
import { ValidationError } from '@err';
import { TelegrafContext } from '@types';
import { createButton, getUserMessage, sendCommandText } from '@fn';
import { WizardScene } from 'telegraf/typings/scenes';

export const taskAddScene: WizardScene<TelegrafContext> = new Scenes.WizardScene('task-add', 
	async(ctx) => {
		await sendCommandText(ctx, 'add-title');
		return ctx.wizard.next();
	},
	async(ctx) => {
		if(checkExit(ctx)) return ctx.scene.enter('exit')
		const message = getUserMessage(ctx);
		ctx.session.task.title = message;
		await sendCommandText(ctx, 'add-body');
		return ctx.wizard.next();
	},
	async(ctx) => {
		if(checkExit(ctx)) return ctx.scene.enter('exit')
		const message = getUserMessage(ctx);
		ctx.session.task.body = message;
		await ctx.replyWithHTML(ctx.i18n.t('task.time'), 
			Markup.inlineKeyboard([[
				createButton(ctx, 'yes'), 
				createButton(ctx, 'no')
			]])
		);
		return ctx.wizard.next();
	},
	async(ctx) => {
		if(checkExit(ctx)) return ctx.scene.enter('exit')
		const buttonId = ctx.callbackQuery?.data;

		switch (buttonId) {
			case 'btn-yes':
				sendCommandText(ctx, 'add-time');
				return ctx.wizard.next();
			default: 
				await ctx.session.task.add(ctx);
				return ctx.scene.leave()
		}
	},
	async(ctx) => {
		if(checkExit(ctx)) return ctx.scene.enter('exit')
		const time = getUserMessage(ctx);
		if(checkTime(time)) throw new ValidationError(ctx.i18n.t('error.time'))
		ctx.session.task.time = time;
		await ctx.session.task.add(ctx);
		return ctx.scene.leave()
	}
);