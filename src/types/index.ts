import I18nContext from 'telegraf-i18n';
import { Context as TelegrafContext } from "telegraf";
import { Animal } from '../util/classes/animal';
import { Place } from '../util/classes/place';

export interface Context extends TelegrafContext {
	readonly i18n: I18nContext;
	scene: any;
	cat: Animal;
	dog: Animal;
	place: Place;
	weather: any;
	task: any;
}