import {Context, Telegraf} from 'telegraf'
import { Update } from 'typegram';
import dotenv from 'dotenv';

dotenv.config();

const bot: Telegraf<Context<Update>> = new Telegraf(process.env.BOT_TOKEN as string);

bot.start((ctx: Context) => ctx.reply(`Привет`));

bot.launch();