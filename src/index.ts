import { Telegraf } from "telegraf";
import dotenv from 'dotenv';
import { session } from "telegraf";
import { Scenes } from 'telegraf';
import { Animal } from "./util/classes/animal";
import mongoose from "mongoose";
import { sendError } from "./util/functions";
import { ValidationError } from "./util/classes/err/validation";
import { AxiosError } from "axios";
import { i18n } from "./i18n";
import * as scenes from './controllers'
import { TelegrafContext } from "./types";
import { UserModel } from "./models/User";
import { Weather } from "./util/classes/weather";
import { TaskModel } from "./models/Task";
import { Task } from "./util/classes/task";
const rateLimit = require('telegraf-ratelimit')

dotenv.config();

const startDb = async() => {
	try{
		await mongoose.connect(process.env.DB_URL as string);
	} catch(e){
		console.log(e)
	}
}

startDb()

export const bot: Telegraf<TelegrafContext> = new Telegraf(process.env.BOT_TOKEN as string);

mongoose.connection.on('open', async() => {

	const users = await UserModel.find();
	bot.context.subs = Object.fromEntries(await Promise.all(
		users.map(async(item) => {
			const weather = new Weather(item._id);
			const task = new Task(item._id)
			return [item._id, {weather, task}]
		})
	))

	bot.catch((err: unknown, ctx: TelegrafContext) => {
		console.log(err)
		if(err instanceof ValidationError) return err.sendError(ctx)
		else if((err as AxiosError).response?.status) return sendError(ctx, 'Неправильно введены данные')
		else {
			ctx.reply('Упс очень странная ошибка, я ее не знаю...');
			return ctx.scene.leave();
		}
	});

	const limitConfig = {
		window: 3000,
		limit: 1,
		onLimitExceeded: (ctx: TelegrafContext) => ctx.reply(ctx.i18n.t('limit'))
	}

	const commands = i18n.t('ru', 'commands').split('\n').map((item: string) => {
		const [command, description] = item.split(' - ');
		return {command, description};
	});

	bot.telegram.setMyCommands(commands)

	const stage = new Scenes.Stage<TelegrafContext>();
	stage.register(...Object.values(scenes));

	bot.use(session());
	bot.use(i18n.middleware());
	bot.use(stage.middleware())
	bot.use(rateLimit(limitConfig))

	bot.context.cat = new Animal('cat');
	bot.context.dog = new Animal('dog');

	bot.start((ctx: TelegrafContext) => ctx.scene.enter('start'));
	bot.help((ctx: TelegrafContext) => ctx.scene.enter('help'));

	const animalSceneIds = ['cat', 'dog'];
	const sceneIds = [...animalSceneIds, 'place', 'weather', 'task', 'weather-follow', 'weather-unfollow', 'task-add', 'task-update']

	sceneIds.forEach((sceneId) => {
		const commandId = animalSceneIds.includes(sceneId) ? 'animal' : sceneId;
		bot.command(commandId, (ctx: TelegrafContext) => ctx.scene.enter(sceneId));
	} )

	stage.command('exit', (ctx: TelegrafContext) => {
		ctx.reply(ctx.i18n.t('exit'));
		return ctx.scene.leave();
	});

	// stage.action('exit', (ctx: TelegrafContext) => {
	// 	ctx.reply(ctx.i18n.t('exit'));
	// 	return ctx.scene.leave();
	// });


// bot.use(async(ctx) => await ctx.reply('Команда началась', Markup.keyboard([
// 	['exit'] 
// ])
// .oneTime()
// .resize()
// ))

	bot.launch();
})