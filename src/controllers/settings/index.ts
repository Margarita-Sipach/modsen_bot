import { Scenes } from 'telegraf';
import { TelegrafContext } from '@types';
import { WizardScene } from 'telegraf/typings/scenes';
import { getChatId } from '@fn';
import { TaskModel, UserModel } from '@models';

export const settingsScene: WizardScene<TelegrafContext> =
  new Scenes.WizardScene('settings', async ctx => {
    console.log('settings');
    const userId = getChatId(ctx);
    if (!userId) return ctx.scene.leave();

    const weather = await UserModel.findById(userId);
    const weatherInfo = {
      time: weather!.time,
      city: weather!.city,
    };

    await ctx.replyWithHTML(
      ctx.i18n.t('settings.weather', {
        weather: weather!.weatherStatus
          ? ctx.i18n.t('weather.followed', weatherInfo)
          : ctx.i18n.t('settings.none'),
      }),
    );

    const tasks = await TaskModel.find({ _id: { $in: weather!.tasks } });
    const tasksInfo =
      tasks
        .filter(item => !item.status && item.time)
        .reduce((acc, item) => {
          const title = item.title;
          const body = item.body;
          const time = `(${item.time})`;
          const info = ctx.i18n.t('task.info', { title, body, time });
          return `${acc}\n${info}`;
        }, '') || ctx.i18n.t('task.empty');

    await ctx.replyWithHTML(ctx.i18n.t('settings.tasks', { tasks: tasksInfo }));
    return ctx.scene.leave();
  });
