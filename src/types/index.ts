import { Context, Scenes } from 'telegraf';
import TelegrafI18n from 'telegraf-i18n';
import { Animal, Place, Weather, Task } from '@classes';
import { CallbackQuery } from 'telegraf/typings/core/types/typegram';

export * from './class';

interface SessionData extends Scenes.WizardSession<Scenes.WizardSessionData> {
  place: Place;
  weather: Weather;
  task: Task;
}

export interface TelegrafContext extends Context {
  cat: Animal;
  dog: Animal;
  i18n: TelegrafI18n;
  subs: {
    [id: string]: {
      weather: Weather;
      task: Task;
    };
  };
  callbackQuery: CallbackQuery.DataQuery | undefined;
  session: SessionData;
  scene: Scenes.SceneContextScene<TelegrafContext, Scenes.WizardSessionData>;
  wizard: Scenes.WizardContextWizard<TelegrafContext>;
}
