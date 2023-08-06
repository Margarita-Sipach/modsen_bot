import I18nContext from 'telegraf-i18n';
import { Context as TelegrafContext } from "telegraf";
import { Animal } from '../util/classes/animal';
import { Place } from '../util/classes/place';
import { Weather } from '../util/classes/weather';

export interface Context extends TelegrafContext {
	readonly i18n: I18nContext;
	scene: any;
	cat: Animal;
	dog: Animal;
	place: Place;
	weather: Weather;
	task: any;
}