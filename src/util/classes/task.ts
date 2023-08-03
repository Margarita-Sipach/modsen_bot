import { Markup } from "telegraf";
import { TaskModel } from "../../models/Task"
import { getChatId } from './../functions/index';
import { User } from "../../models/User";

export class Task {

	_title: string;
	_body: string;
	_id: any;

	constructor(){
		this._title = ''
		this._body = ''
	}

	set title(title:  string){
		this._title = title
	}

	set body(body:  string){
		this._body = body
	}

	set id(id: any){
		this._id = id
	}

	async add(ctx: any){
		if(this._title && this._body){
			const userId = getChatId(await ctx)
			const task = await TaskModel.create({title: this._title, body: this._body, status: false})

			await User.findByIdAndUpdate(
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

	async update(ctx: any){

	}

	async delete(userId: number){
		await TaskModel.findByIdAndDelete(this._id);
		await User.findByIdAndUpdate(
			userId,
			{ $pull: { tasks: this._id } }
		);
	}

	async complete(ctx: any){
		await TaskModel.findByIdAndUpdate(this._id, {status: true});
	}

	async getTasks(userId: number){
		const taskIds = (await User.findById(userId))!.tasks;
		const tasks = await TaskModel.find({ '_id': { $in: taskIds } });
		return tasks
	}
}