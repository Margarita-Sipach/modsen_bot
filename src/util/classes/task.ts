import { Markup } from "telegraf";
import { TaskModel } from "../../models/Task"
import { getChatId } from './../functions/index';
import { UserModel } from "../../models/User";
import cron from 'node-cron';

export class Task {

	_title: string;
	_body: string;
	_id: any;
	_time: string

	constructor(){
		this._title = ''
		this._body = ''
		this._time = ''
	}

	set title(title:  string){
		this._title = title
	}

	set body(body:  string){
		this._body = body
	}

	set time(time:  string){
		this._time = time
	}

	set id(id: any){
		this._id = id
	}

	async add(ctx: any){
		if(this._title && this._body){
			const title = this._title;
			const body = this._body;
			const time = this._time.split(':').reverse().join(' ');

			const userId = getChatId(await ctx)
			const cronId = cron.schedule(`${time} * * *`, async() => {
				ctx.replyWithHTML(ctx.i18n.t('task.info', {title, body})
			)});

			const task = await TaskModel.create({title: this._title, body: this._body, time: this._time, cronId, status: false})

			await UserModel.findByIdAndUpdate(
				userId,
				{ $push: { tasks: task._id } },
				{ new: true, useFindAndModify: false }
			);

			await ctx.replyWithHTML(ctx.i18n.t('task.info', {title: this._title, body: this._body}))
			await ctx.reply(ctx.i18n.t('task.add-success'));

			this._title = '';
			this._body = '';
		}
	}

	async cron(){

	}

	async delete(userId: number){
		await TaskModel.findByIdAndDelete(this._id);
		await UserModel.findByIdAndUpdate(
			userId,
			{ $pull: { tasks: this._id } }
		);
	}

	async complete(ctx: any){
		await TaskModel.findByIdAndUpdate(this._id, {status: true});
	}

	async getTasks(userId: number){
		const taskIds = (await UserModel.findById(userId))!.tasks;
		const tasks = await TaskModel.find({ '_id': { $in: taskIds } });
		return tasks
	}
}