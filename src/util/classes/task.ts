import { Markup, Telegraf } from "telegraf";
import { TaskModel } from "../../models/Task"
import { getChatId, strike } from './../functions/index';
import { UserModel } from "../../models/User";
import cron from 'node-cron';
import { Cron } from "./cron";
import { TelegrafContext } from "../../types";
import { bot } from "../..";
import { i18n } from "../../i18n";
import { TaskType } from "../../types/class";

export class Task {

	title: string = '';
	body: string = '';
	time: string = '';

	id: string = '';

	cron: {[key: string]: Cron<TaskType>} = {};

	constructor(private readonly userId: number){
		this.init();
	}

	async init(){
		const sendHTML = async({title, body}: TaskType) => {
			bot.telegram.sendMessage(
				this.userId, 
				i18n.t('ru', 'task.info', {title, body}), 
				{parse_mode: 'HTML'}
			);
		}
		(await this.getTasks()).forEach(item => {
			this.cron[String(item._id)] = new Cron(sendHTML)
			item.status && (this.cron[String(item._id)].start(item.time, item as TaskType))
		})
	}

	async add(ctx: TelegrafContext){

		if(this.title && this.body){
			const time = this.time
			const taskInfo = {
				title: this.title, 
				body: this.body,
			}

			const task = await TaskModel.create({time, ...taskInfo})

			await UserModel.findByIdAndUpdate(
				this.userId,
				{ $push: { tasks: task._id } },
				{ new: true, useFindAndModify: false }
			);

			await ctx.replyWithHTML(ctx.i18n.t('task.info', taskInfo))
			await ctx.reply(ctx.i18n.t('task.add-success'));

			time && this.cron[String(task._id)].start(time, taskInfo)

			this.title = '';
			this.body = '';
			this.time = ''
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

	async incomplete(){
		await TaskModel.findByIdAndUpdate(
			this.id, 
			{status: false}
		);
		this.stopCron()
	}

	async stopCron(){
		this.cron?.[this.id.toString()]?.stop()
		this.id = ''
	}

	async getTasks(){
		const tasksIds = (await UserModel.findById(this.userId))!.tasks;
		const tasks = await TaskModel.find({ '_id': { $in: tasksIds } });
		return tasks
	}
}