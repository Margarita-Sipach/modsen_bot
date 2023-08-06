import { User } from "../../models/User";
import { Parent } from "./parent";
import { createButton, getChatId } from "../functions";
import { Markup } from "telegraf";
import cron from 'node-cron';

interface APIWeatherType{
  weather: [{ 
		description: string
	}],
  base: string,
  main: {
    temp: number,
  },
  wind: { 
		speed: number 
	},
}

export class Weather extends Parent {

	cronId: any = '';
	city: string = ''

	constructor(){
		super('https://api.openweathermap.org/data/2.5/weather', process.env.WEATHER_KEY as string);
	}

	async displayWeatherInfo(ctx: any) {
		const weatherInfo = await this.getCityWeather();
	
		await ctx.replyWithHTML(
			ctx.i18n.t('weather.info', {...weatherInfo, city: this.city}), 
			Markup.inlineKeyboard([createButton(ctx, 'newCity', 'weather')])
		);
	}

	async getCityWeather(){
		const weatherInfo: APIWeatherType | Error = await this.getData(
			[
				['q', this.city], 
				['appid', this.key], 
				['lang', 'ru'], 
				['units', 'metric']
			]
		);
		
		if(weatherInfo instanceof Error) return weatherInfo;
		
		const [firstLetter, ...rest] = weatherInfo.weather[0].description

		return {
			desc: `${firstLetter.toUpperCase()}${rest.join('')}`, 
			temp: weatherInfo.main.temp, 
			speed: weatherInfo.wind.speed
		}
	}

	async follow(ctx: any){
		const time = ctx.message.text.split(':').reverse().join(' ');

		await User.findOneAndUpdate(
			{_id: getChatId(ctx), weatherStatus: false}, 
			{weatherStatus: true, city: this.city, time}
		);
		await ctx.reply(ctx.i18n.t('weather.followSuccess'))

		this.cronId = cron.schedule(`${time} * * *`, async() => this.displayWeatherInfo(ctx));
	}

	async unfollow (ctx: any) {
		await User.findOneAndUpdate(
			{_id: getChatId(ctx), weatherStatus: true}, 
			{weatherStatus: false}
		);
		await this.cronId.stop()
		await ctx.editMessageText(ctx.i18n.t('weather.unfollowSuccess'))
	}
}