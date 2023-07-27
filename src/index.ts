import { Telegraf } from "telegraf";
import TelegrafI18n from 'telegraf-i18n';
import { Context } from "./types";
import dotenv from 'dotenv';
import path from 'path';
import {MongoClient} from 'mongodb';
import { session } from "telegraf";
import { Scenes } from 'telegraf';
import { helpScene, startScene } from "./controllers";

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
stage.register(startScene, helpScene);

bot.use(session());
bot.use(i18n.middleware());
bot.use(stage.middleware() as any);

bot.start((ctx: Context) => ctx.scene.enter('start'));
bot.help((ctx: Context) => ctx.scene.enter('help'));

bot.launch();