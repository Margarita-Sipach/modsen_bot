import I18nContext from 'telegraf-i18n';
import { Context as TelegrafContext } from "telegraf";

export interface Context extends TelegrafContext {
	readonly i18n: I18nContext;
}