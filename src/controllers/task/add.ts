import { Markup, Scenes } from 'telegraf'

export const taskAddScene = new Scenes.WizardScene('task-add', 
	async(ctx: any) => {
		await ctx.reply(ctx.i18n.t('task.add-title'));
		return ctx.wizard.next();
	},
	async(ctx: any) => {
		ctx.task.title = await ctx.message.text;
		await ctx.reply(ctx.i18n.t('task.add-body'));
		return ctx.wizard.next();
	},
	async(ctx: any) => {
		ctx.task.body = await ctx.message.text;
		await ctx.task.add(ctx);
		ctx.scene.enter('task');
		return ctx.scene.leave();
	},
);