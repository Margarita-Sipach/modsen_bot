import { Markup, Scenes } from 'telegraf';
import { createButton, getChatId, strike } from '@fn';
import { TelegrafContext } from '@types';
import { WizardScene } from 'telegraf/typings/scenes';
import { checkExit } from '@check';

export const taskScene: WizardScene<TelegrafContext> = new Scenes.WizardScene(
  'task',
  async ctx => {
    const chatId = getChatId(ctx);
    if (!chatId) return ctx.scene.leave();

    ctx.session.task = ctx.subs[chatId].task;
    const tasks = await ctx.session.task.getTasks();
    const tasksInfo =
      tasks.reduce((acc, item, index) => {
        const title = `${index + 1}. ${item.title}`;
        const body = item.body;
        const time = item.time ? `(${item.time})` : '';
        const info = ctx.i18n.t('task.info', { title, body, time });
        return `${acc}\n${item.status ? strike(info) : info}`;
      }, '') || ctx.i18n.t('task.empty');

    await ctx.replyWithHTML(
      ctx.i18n.t('task.list', { tasks: tasksInfo }),
      Markup.inlineKeyboard([
        [createButton(ctx, 'add')],
        [createButton(ctx, 'update')],
      ]),
    );
    return ctx.wizard.next();
  },
  async ctx => {
    console.log(checkExit(ctx));
    if (checkExit(ctx)) return ctx.scene.enter('exit');
    const buttonId = ctx.callbackQuery?.data;

    switch (buttonId) {
      case 'btn-add':
        ctx.scene.enter('task-add');
        break;
      case 'btn-update':
        ctx.scene.enter('task-update');
        break;
    }
    return ctx.scene.leave();
  },
);
