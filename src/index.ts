import { Telegraf } from "telegraf";
import TelegrafI18n from 'telegraf-i18n';
import { Context } from "./types";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const i18n = new TelegrafI18n({
	defaultLanguage: 'ru',
	allowMissing: false,
	directory: path.resolve(__dirname, 'locales'),
});

const bot: Telegraf<Context> = new Telegraf(process.env.BOT_TOKEN as string);

bot.use(i18n.middleware());

bot.start(ctx => ctx.reply(ctx.i18n.t('hello', {ctx})));

bot.launch();