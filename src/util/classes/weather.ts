import { User } from "../../models/User";
import { Parent } from "./parent";
import { getChatId } from "../functions";
import { Markup } from "telegraf";
import cron from 'node-cron';

export class Weather extends Parent {

	_city: string;
	cronId: any;

	constructor(){
		super('https://api.openweathermap.org/data/2.5/weather', process.env.WEATHER_KEY as string);
		this._city = '';
		this.cronId = '';
	}

	set city(city: string) {
		this._city = city;
	}

	async displayWeatherInfo(ctx: any) {
		const weatherInfo = await this.getCityWeather();
	
		await ctx.replyWithHTML(
			ctx.i18n.t('weather.info', {...weatherInfo, city: this._city}), 
			Markup.inlineKeyboard([Markup.button.callback(ctx.i18n.t('weather.newCity'), 'weather-city')])
		);
	}

	async getCityWeather(){
		const json = await this.getData(this.url, [['q', this._city], ['appid', this.key], ['lang', 'ru']]);
		const [firstLetter, ...rest] = json.weather[0].description
		return {desc: `${firstLetter.toUpperCase()}${rest}`, temp: json.main.temp, speed: json.wind.speed}
	}

	async follow(ctx: any){
		const time = ctx.message.text.split(':').reverse().join(' ');

		await User.findOneAndUpdate(
			{_id: getChatId(ctx), weatherStatus: false}, 
			{weatherStatus: true, city: this._city, time}
		);
		await ctx.reply(ctx.i18n.t('weather.followSuccess'))

		this.cronId = cron.schedule(`${time} * * *`, async() => ctx.weather.displayWeatherInfo(ctx));
	}

	async unfollow (ctx: any) {
		await User.findOneAndUpdate({_id: getChatId(ctx), weatherStatus: true}, {weatherStatus: false});
		await this.cronId.stop()
		await ctx.editMessageText(ctx.i18n.t('weather.unfollowSuccess'))
	}
}