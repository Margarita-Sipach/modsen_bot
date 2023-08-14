import { Context, Scenes } from "telegraf";
import TelegrafI18n from 'telegraf-i18n';
import { Animal } from "../util/classes/animal";
import { Place } from "../util/classes/place";
import { Weather } from "../util/classes/weather";
import { Task } from "../util/classes/task";
import {  CallbackQuery } from "telegraf/typings/core/types/typegram";

interface SessionData extends Scenes.WizardSession<Scenes.WizardSessionData> {
	place: Place;
	weather: Weather;
	task: Task
}

export interface TelegrafContext extends Context {
	cat: Animal;
	dog: Animal;
	i18n: TelegrafI18n;
	subs: {
		[id: string]: {
			weather: Weather;
			task: Task;
		}
	}
	callbackQuery: CallbackQuery.DataQuery | undefined;
	session: SessionData;
	scene: Scenes.SceneContextScene<TelegrafContext, Scenes.WizardSessionData>;
	wizard: Scenes.WizardContextWizard<TelegrafContext>;
}
