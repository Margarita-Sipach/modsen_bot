import { Markup, Telegraf } from "telegraf";
import TelegrafI18n from 'telegraf-i18n';
import { Context } from "./types";
import dotenv from 'dotenv';
import path from 'path';
import { session } from "telegraf";
import { Scenes } from 'telegraf';
import { helpScene, placeScene, startScene, taskAddScene, taskScene, weatherFollowScene, weatherScene } from "./controllers";
import { Animal } from "./util/classes/animal";
import { Weather } from "./util/classes/weather";
import mongoose from "mongoose";
import { Task } from "./util/classes/task";
import { taskUpdateScene } from "./controllers/task/update";
import { animalScene } from "./controllers/animal";
import { sendError } from "./util/functions";
import { ValidationError } from "./util/classes/err/validation";
import axios, { AxiosError } from "axios";

dotenv.config();

const i18n = new TelegrafI18n({
	defaultLanguage: 'ru',
	allowMissing: false,
	directory: path.resolve(__dirname, 'locales'),
});

const startDb = async() => {
	try{
		await mongoose.connect(process.env.DB_URL as string);
	} catch(e){
		console.log(e)
	}
}

startDb()

mongoose.connection.on('open', () => {

	const bot: Telegraf<Context> = new Telegraf(process.env.BOT_TOKEN as string);
	bot.catch((err, ctx) => {
		if((err as AxiosError).response?.status) {
			console.log((err as AxiosError).response?.status);
			return sendError(ctx, 'Неправильно введены данные')
		}
		if(err instanceof ValidationError) return err.sendError(ctx)
		return ctx.reply('Упс очень странная ошибка, я ее не знаю...');
	});

	const commands = i18n.t('ru', 'commands').split('\n').map((item: string) => {
		const [command, description] = item.split(' - ');
		return {command, description};
	});

	bot.telegram.setMyCommands(commands)

	const stage = new Scenes.Stage();
	stage.register(
		startScene, 
		helpScene, 
		placeScene, 
		weatherScene, 
		taskScene, 
		taskAddScene, 
		taskUpdateScene, 
		animalScene,
		weatherFollowScene
	);

	bot.use(session());
	bot.use(i18n.middleware());
	bot.use(stage.middleware());

	bot.context.cat = new Animal('cat');
	bot.context.dog = new Animal('dog');

	bot.start((ctx: Context) => ctx.scene.enter('start'));
	bot.help((ctx: Context) => ctx.scene.enter('help'));

	bot.command('cat', (ctx: Context) => ctx.scene.enter('animal'));
	bot.command('dog', (ctx: Context) => ctx.scene.enter('animal'));
	bot.command('place', (ctx: Context) => ctx.scene.enter('place'));
	bot.command('weather', (ctx: Context) => ctx.scene.enter('weather'));
	bot.command('task', (ctx: Context) => ctx.scene.enter('task'));

	bot.command('weather-follow', (ctx: Context) => ctx.scene.enter('weather-follow'));

	bot.command('task-add', (ctx: Context) => ctx.scene.enter('task-add'));
	bot.command('task-update', (ctx: Context) => ctx.scene.enter('task-update'));

	stage.command('exit', (ctx: any) => {
		ctx.reply(ctx.i18n.t('exit'));
		return ctx.scene.leave();
	});

	bot.launch();
})

