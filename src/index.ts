import 'module-alias/register';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { session, Scenes } from 'telegraf';
import { i18n } from './i18n';
import * as scenes from './controllers';
import { TelegrafContext } from '@types';
import { ValidationError } from '@err';
import { Task, Weather, Animal } from '@classes';
import { sendText } from '@fn';
import { UserModel } from '@models';
import { bot } from './bot';
const rateLimit = require('telegraf-ratelimit');

dotenv.config();

const startDb = async () => {
  try {
    console.log('startDB');
    await mongoose.connect(process.env.DB_URL as string);
  } catch (e) {
    console.log(e);
  }
};

startDb();

const initSubs = async () => {
  const users = await UserModel.find();
  bot.context.subs = Object.fromEntries(
    await Promise.all(
      users.map(async item => {
        const weather = new Weather(item._id);
        const task = new Task(item._id);
        return [item._id, { weather, task }];
      }),
    ),
  );
};

mongoose.connection.on('open', async () => {
  console.log('openDB');

  await initSubs();

  bot.catch((err: unknown, ctx: TelegrafContext) => {
    console.log(err);
    if (err instanceof ValidationError) {
      err.sendError(ctx);
    } else {
      sendText(ctx, 'error.unknown');
      ctx.scene.leave();
    }
  });

  const limitConfig = {
    window: 3000,
    limit: 1,
    onLimitExceeded: (ctx: TelegrafContext) => sendText(ctx, 'limit'),
  };

  const commands = i18n
    .t('ru', 'commands')
    .split('\n')
    .map((item: string) => {
      const [command, description] = item.split(' - ');
      return { command, description };
    });

  bot.telegram.setMyCommands(commands);

  const stage = new Scenes.Stage<TelegrafContext>();
  stage.register(...Object.values(scenes));

  bot.use(session());
  bot.use(i18n.middleware());
  bot.use(stage.middleware());
  bot.use(rateLimit(limitConfig));

  bot.context.cat = new Animal('cat');
  bot.context.dog = new Animal('dog');

  bot.start((ctx: TelegrafContext) => ctx.scene.enter('start'));
  bot.help((ctx: TelegrafContext) => ctx.scene.enter('help'));

  const animalSceneIds = ['cat', 'dog'];
  const sceneIds = [
    ...animalSceneIds,
    'place',
    'place-type',
    'weather',
    'task',
    'weather-follow',
    'weather-unfollow',
    'weather-city',
    'task-add',
    'task-update',
    'exit',
    'settings',
  ];

  sceneIds.forEach(sceneId => {
    const commandId = animalSceneIds.includes(sceneId) ? 'animal' : sceneId;
    bot.command(sceneId, (ctx: TelegrafContext) => ctx.scene.enter(commandId));
  });

  bot.launch();
});
