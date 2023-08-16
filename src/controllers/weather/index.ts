import { Markup, Scenes } from 'telegraf';
import { converDateToString, createButton, getChatId } from '@fn';
import { TelegrafContext } from '@types';
import { WizardScene } from 'telegraf/typings/scenes';
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

      const info = ctx.session.weather;

      const sendInfo =
        info.time && info.status && info.city
          ? ctx.i18n.t('weather.followed', {
              city: info?.city,
              time: converDateToString(info?.time),
            })
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
