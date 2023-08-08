import { Markup, Scenes } from 'telegraf'
import { Task } from '../../util/classes/task';
import { checkTime } from '../../util/functions/check';
import { sendError } from '../../util/functions';
import { ValidationError } from '../../util/classes/err/validation';

export const taskAddScene = new Scenes.WizardScene('task-add', 
	async(ctx: any) => {
		await ctx.reply(ctx.i18n.t('task.add-title'));
		console.log(ctx.session)
		return ctx.wizard.next();
	},
	async(ctx: any) => {
		ctx.session.task.title = await ctx.message.text;
		await ctx.reply(ctx.i18n.t('task.add-body'));
		return ctx.wizard.next();
	},
	async(ctx: any) => {
		ctx.session.task.body = await ctx.message.text;
		await ctx.reply(ctx.i18n.t('task.add-time'));
		return ctx.wizard.next();
	},
	async(ctx: any) => {
		const time = await ctx.message.text;
		if(checkTime(time)) throw new ValidationError(ctx.i18n.t('error.time'))
		ctx.session.task.time = time;
		await ctx.session.task.add(ctx);
		await ctx.scene.enter('task');
	},
);