import { Scenes } from 'telegraf';
import { UserModel } from '@models';
import { getChatId, sendCommandText } from '@fn';
import { TelegrafContext } from '@types';
import { Task, Weather } from '@classes';
import { WizardScene } from 'telegraf/typings/scenes';
import { Message } from 'telegraf/typings/core/types/typegram';

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

    const name =
      (ctx.message as Message.TextMessage).from?.first_name || 'Гость';
    await sendCommandText(ctx, 'hello', { name });
    return ctx.scene.leave();
  },
);
