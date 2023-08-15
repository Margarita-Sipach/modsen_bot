import { Scenes } from 'telegraf';
import { UserModel } from '@models';
import { getChatId, sendCommandText } from '@fn';
import { TelegrafContext } from '@types';
import { Task, Weather } from '@classes';
import { WizardScene } from 'telegraf/typings/scenes';

export const startScene: WizardScene<TelegrafContext> = new Scenes.WizardScene(
  'start',
  async ctx => {
    console.log('start');
    const chatId = getChatId(ctx);

    if (!chatId) return;
    const isUserExist = await UserModel.findById(chatId);

    if (!isUserExist) {
      await UserModel.create({ _id: chatId });
      ctx.subs[chatId] = {
        weather: new Weather(chatId),
        task: new Task(chatId),
      };
    }

    await sendCommandText(ctx, 'hello', { ctx });
    return ctx.scene.leave();
  },
);
