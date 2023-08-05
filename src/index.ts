import { Telegraf } from "telegraf";
import TelegrafI18n from 'telegraf-i18n';
import { Context } from "./types";
import dotenv from 'dotenv';
import path from 'path';
import { session } from "telegraf";
import { Scenes } from 'telegraf';
import { helpScene, placeScene, startScene, taskAddScene, taskScene, weatherScene } from "./controllers";
import { Animal } from "./util/classes/animal";
import { Weather } from "./util/classes/weather";
import mongoose from "mongoose";
import { Task } from "./util/classes/task";
import { taskUpdateScene } from "./controllers/task/update";
import { animalScene } from "./controllers/animal";

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

	const commands = i18n.t('ru', 'commands').split('\n').map((item: string) => {
		const [command, description] = item.split(' - ');
		return {command, description};
	});

	bot.telegram.setMyCommands(commands)

	const stage = new Scenes.Stage();
	stage.register(startScene, helpScene, placeScene, weatherScene, taskScene, taskAddScene, taskUpdateScene, animalScene);

	bot.use(session());
	bot.use(i18n.middleware());
	bot.use(stage.middleware());

	bot.context.cat = new Animal('cat');
	bot.context.dog = new Animal('dog');
	// bot.context.weather = new Weather();
	// bot.context.task = new Task();
	
	bot.start((ctx: Context) => ctx.scene.enter('start'));
	bot.help((ctx: Context) => ctx.scene.enter('help'));
	
	bot.command('cat', (ctx: Context) => ctx.scene.enter('animal'));
	bot.command('dog', (ctx: Context) => ctx.scene.enter('animal'));
	bot.command('place', (ctx: Context) => ctx.scene.enter('place'));
	// bot.command('weather', (ctx: Context) => ctx.scene.enter('weather'));
	// bot.command('task', (ctx: Context) => ctx.scene.enter('task'));

	// bot.command('task-add', (ctx: Context) => ctx.scene.enter('task-add'));
	// bot.command('task-update', (ctx: Context) => ctx.scene.enter('task-update'));

	bot.launch();
})

