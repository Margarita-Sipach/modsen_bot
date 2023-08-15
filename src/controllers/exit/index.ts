import { Scenes } from 'telegraf';
import { TelegrafContext } from '@types';
import { WizardScene } from 'telegraf/typings/scenes';
import { sendCommandText } from '@fn';

export const exitScene: WizardScene<TelegrafContext> = new Scenes.WizardScene(
  'exit',
  async ctx => {
    console.log('exit');
    sendCommandText(ctx);
    return ctx.scene.leave();
  },
);
