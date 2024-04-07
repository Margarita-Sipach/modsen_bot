import { Markup, Scenes } from 'telegraf';
import { createButton, getChatId } from '@fn';
import { TelegrafContext } from '@types';
import { WizardScene } from 'telegraf/typings/scenes';
import { UserModel } from '@models';
import { checkExit } from '@check';

export const weatherScene: WizardScene<TelegrafContext> =
  new Scenes.WizardScene(
    'weather',
    async ctx => {
      console.log('weather');
      const chatId = getChatId(ctx);
      if (!chatId) return ctx.scene.leave();

      ctx.session.weather = ctx.subs[chatId].weather;

      const noteButton = ctx.session.weather.status
        ? [createButton(ctx, 'unfollow', { city: ctx.session.weather.city })]
        : [];

      const info = await UserModel.findById(chatId);

      const sendInfo = ctx.session.weather.status
        ? ctx.i18n.t('weather.followed', { city: info?.city, time: info?.time })
        : ctx.i18n.t('weather.unfollowed');

      await ctx.replyWithHTML(
        sendInfo,
        Markup.inlineKeyboard([
          [...noteButton],
          [createButton(ctx, 'newCity')],
        ]),
      );

      return ctx.wizard.next();
    },
    async ctx => {
      if (checkExit(ctx)) return ctx.scene.enter('exit');
      const buttonId = ctx.callbackQuery?.data;

      switch (buttonId) {
        case 'btn-newCity':
          ctx.scene.enter('weather-city');
          break;
        case 'btn-unfollow':
          ctx.scene.enter('weather-unfollow');
          break;
      }

      return ctx.scene.leave();
    },
  );
