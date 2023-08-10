import { Context, Markup, Scenes } from "telegraf";
import TelegrafI18n from 'telegraf-i18n';
import { Animal } from "../util/classes/animal";
import { Place } from "../util/classes/place";
import { Weather } from "../util/classes/weather";
import { Task } from "../util/classes/task";
import {  Message, Update } from "telegraf/typings/core/types/typegram";
import { callbackQuery } from "telegraf/filters";
import { Deunionize, PropOr } from "telegraf/typings/deunionize";

interface SessionData extends Scenes.WizardSession<Scenes.WizardSessionData> {
	place: Place;
	weather: Weather;
	task: Task
}

export interface TelegrafContext extends Context<Update.MessageUpdate<Message.TextMessage>> {
	i18n: TelegrafI18n;
	session: SessionData;
	scene: Scenes.SceneContextScene<TelegrafContext, Scenes.WizardSessionData>;
	wizard: any//Scenes.WizardContextWizard<TelegrafContext>;
	cat: Animal;
	dog: Animal;
	callbackQuery: any;
	subs: {
		[id: string]: {
			weather: Weather;
			task: Task;
		}
	}
}


