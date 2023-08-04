import I18nContext from 'telegraf-i18n';
import { Context as TelegrafContext } from "telegraf";
import { Animal } from '../util/classes/animal';

export interface Context extends TelegrafContext {
	readonly i18n: I18nContext;
	scene: any;
	cat: Animal;
	dog: Animal;
	place: any;
	weather: any;
	task: any;
}