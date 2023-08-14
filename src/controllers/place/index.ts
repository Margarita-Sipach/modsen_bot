import { Markup, Scenes } from 'telegraf'
import { Place } from '../../util/classes/place';
import { createButton, getUserMessage, sendCommandText } from '../../util/functions';
import { checkCity } from '../../util/functions/check';
import { ValidationError } from '../../util/classes/err/validation';
import { TelegrafContext } from '../../types';
import { WizardScene } from 'telegraf/typings/scenes';

export const placeScene: WizardScene<TelegrafContext> = new Scenes.WizardScene('place', 
	async(ctx: TelegrafContext) => {
		ctx.session.place = new Place()
		sendCommandText(ctx, 'city');
		return ctx.wizard.next();
	},
	async(ctx: TelegrafContext) => {
		try{
			const city = getUserMessage(ctx);
			if(checkCity(city)) throw new ValidationError(ctx.i18n.t('error.city'));

			await ctx.session.place.setCoordinates(city);
			await ctx.scene.enter('place-type');
		}catch(e){
			throw new ValidationError(ctx.i18n.t('error.city'))
		}
	},
);