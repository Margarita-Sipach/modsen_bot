import { TelegrafContext } from '@types';
import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config();

const newBot: Telegraf<TelegrafContext> = new Telegraf(
  process.env.BOT_TOKEN as string,
);

export const bot: Telegraf<TelegrafContext> = newBot;
