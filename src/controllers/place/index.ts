import { Scenes } from 'telegraf'
import { Place } from '@classes';
import { getUserMessage, sendCommandText } from '@fn';
import { checkCity } from '@check';
import { ValidationError } from '@err';
import { TelegrafContext } from '@types';
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