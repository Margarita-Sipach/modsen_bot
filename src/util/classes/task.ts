import { Markup } from "telegraf";
import { TaskModel } from "../../models/Task"
import { getChatId } from './../functions/index';
import { UserModel } from "../../models/User";
import cron from 'node-cron';
import { Cron } from "./cron";
import { TelegrafContext } from "../../types";

export class Task {

	title: string = '';
	body: string = '';
	id: string = '';
	time: string = '';
	cron: {[hey: string]: Cron} = {};

	async add(ctx: TelegrafContext){
		if(this.title && this.body){
			const title = this.title;
			const body = this.body;
			const time = this.time.split(':').reverse().join(' ');

			const userId = getChatId(await ctx)
			const task = await TaskModel.create({title, body, time, status: false})

			await UserModel.findByIdAndUpdate(
				userId,
				{ $push: { tasks: task._id } },
				{ new: true, useFindAndModify: false }
			);

			await ctx.replyWithHTML(ctx.i18n.t('task.info', {title: this.title, body: this.body}))
			await ctx.reply(ctx.i18n.t('task.add-success'));

			const taskId = task._id.toString()
			this.cron[taskId] = new Cron(time, () => ctx.replyWithHTML(ctx.i18n.t('task.info', {title, body})));

			this.title = '';
			this.body = '';
		}
	}

	async delete(userId: number){
		await TaskModel.findByIdAndDelete(this.id);
		await UserModel.findByIdAndUpdate(
			userId,
			{ $pull: { tasks: this.id } }
		);

		this.stopCron()
	}

	async complete(){
		await TaskModel.findByIdAndUpdate(
			this.id, 
			{status: true}
		);
		this.stopCron()
	}

	async stopCron(){
		this.cron?.[this.id.toString()]?.stop()
		this.id = ''
	}

	async getTasks(userId: number){
		const taskIds = (await UserModel.findById(userId))!.tasks;
		const tasks = await TaskModel.find({ '_id': { $in: taskIds } });
		return tasks
	}
}