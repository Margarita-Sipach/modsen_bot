import { Telegraf } from "telegraf";
import TelegrafI18n from 'telegraf-i18n';
import { Context } from "./types";
import dotenv from 'dotenv';
import path from 'path';
import {MongoClient} from 'mongodb';
import { session } from "telegraf";
import { Scenes } from 'telegraf';
import { catScene, dogScene, helpScene, placeScene, startScene, weatherScene } from "./controllers";
import { Animal } from "./util/classes/animal";
import { Place } from "./util/classes/place";
import { Weather } from "./util/classes/weather";

dotenv.config();

const i18n = new TelegrafI18n({
	defaultLanguage: 'ru',
	allowMissing: false,
	directory: path.resolve(__dirname, 'locales'),
});

const client = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qtdfe3h.mongodb.net/?retryWrites=true&w=majority`);
const startDb = async() => {
	try{
		await client.connect()
		console.log('соединение')
	} catch(e){
		console.log(e)
	}
}

startDb()

const bot: Telegraf<Context> = new Telegraf(process.env.BOT_TOKEN as string);

const stage = new Scenes.Stage();
stage.register(startScene, helpScene, catScene, dogScene, placeScene, weatherScene);

bot.use(session());
bot.use(i18n.middleware());
bot.use(stage.middleware() as any);

bot.context.cat = new Animal('cat')
bot.context.dog = new Animal('dog')
bot.context.place = new Place()
bot.context.weather = new Weather()

bot.start((ctx: Context) => ctx.scene.enter('start'));
bot.help((ctx: Context) => ctx.scene.enter('help'));

bot.command('cat', (ctx: Context) => ctx.scene.enter('cat'));
bot.command('dog', (ctx: Context) => ctx.scene.enter('dog'));
bot.command('place', (ctx: Context) => ctx.scene.enter('place'));
bot.command('weather', (ctx: Context) => ctx.scene.enter('weather'));

bot.launch();