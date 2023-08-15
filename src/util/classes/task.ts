import { TaskModel, UserModel } from "@models"
import { sendCommandText } from '@fn';
import { Cron } from "./cron";
import { TelegrafContext, TaskType } from "@types";
import { i18n } from "@i18n";
import { bot } from "@bot";

export class Task {

	title: string = '';
	body: string = '';
	time: string = '';

	id: string = '';

	cron: {[key: string]: Cron<TaskType>} = {};

	constructor(private readonly userId: number){
		this.init();
	}

	sendHTML() {
		const userId = this.userId;
		return ({title, body, time}: TaskType) => {
			bot.telegram.sendMessage(
				userId, 
				i18n.t('ru', 'task.info', {title, body, time}), 
				{parse_mode: 'HTML'}
			);
		}
	}

	async init(){

		(await this.getTasks()).forEach(item => {
			if(item.status && item.time){
				this.cron[String(item._id)] = new Cron(this.sendHTML());
				this.cron[String(item._id)].start(item.time, item as TaskType);
			}
		})
	}

	async add(ctx: TelegrafContext){

		if(this.title && this.body){
			const taskInfo = {
				title: this.title, 
				body: this.body,
				time: this.time
			}

			const task = await TaskModel.create(taskInfo)

			await UserModel.findByIdAndUpdate(
				this.userId,
				{ $push: { tasks: task._id } },
				{ new: true, useFindAndModify: false }
			);

			await ctx.replyWithHTML(ctx.i18n.t('task.info', taskInfo))
			await sendCommandText(ctx, 'add-success')

			this.cron[String(task._id)] = new Cron(this.sendHTML())
			this.time && this.cron[String(task._id)].start(this.time, taskInfo)

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