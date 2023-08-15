import { Markup, Scenes } from 'telegraf';
import { createButton } from '@fn';
import { ValidationError } from '@err';
import { TelegrafContext } from '@types';
import { WizardScene } from 'telegraf/typings/scenes';
import { checkExit } from '@check';

export const placeTypeScene: WizardScene<TelegrafContext> =
  new Scenes.WizardScene(
    'place-type',
    async (ctx: TelegrafContext) => {
      await ctx.replyWithHTML(
        ctx.i18n.t('place.type'),
        Markup.inlineKeyboard([
          [createButton(ctx, 'natural'), createButton(ctx, 'historic')],
          [createButton(ctx, 'cultural'), createButton(ctx, 'architecture')],
        ]),
      );
      return ctx.wizard.next();
    },
    async (ctx: TelegrafContext) => {
      if (checkExit(ctx)) return ctx.scene.enter('exit');
      try {
        const buttonId = ctx.callbackQuery?.data;

        if (!buttonId) throw new ValidationError(ctx.i18n.t('error.placeType'));
        await ctx.session.place.getAllElements(buttonId.replace('btn-', ''));

        const place = await ctx.session.place.getNewElement();
        const { title, text, link, img } = place;

        img && (await ctx.replyWithPhoto({ url: img }));
        await ctx.replyWithHTML(
          ctx.i18n.t('place.info', { title, text }),
          Markup.inlineKeyboard([
            [Markup.button.url(ctx.i18n.t('place.more'), link)],
          ]),
        );
      } catch (e) {
        throw new ValidationError(ctx.i18n.t('error.placeType'));
      }
      return ctx.scene.leave();
    },
  );
