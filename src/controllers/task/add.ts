import { Scenes } from 'telegraf'
import { checkTime } from '../../util/functions/check';
import { ValidationError } from '../../util/classes/err/validation';
import { TelegrafContext } from '../../types';

export const taskAddScene = new Scenes.WizardScene('task-add', 
	async(ctx: TelegrafContext) => {
		await ctx.reply(ctx.i18n.t('task.add-title'));
		console.log(ctx.session)
		return ctx.wizard.next();
	},
	async(ctx: TelegrafContext) => {
		ctx.session.task.title = ctx.message.text;
		await ctx.reply(ctx.i18n.t('task.add-body'));
		return ctx.wizard.next();
	},
	async(ctx: TelegrafContext) => {
		ctx.session.task.body = ctx.message.text;
		await ctx.reply(ctx.i18n.t('task.add-time'));
		return ctx.wizard.next();
	},
	async(ctx: TelegrafContext) => {
		const time = ctx.message.text;
		if(checkTime(time)) throw new ValidationError(ctx.i18n.t('error.time'))
		ctx.session.task.time = time;
		await ctx.session.task.add(ctx);
		await ctx.scene.enter('task');
	},
);