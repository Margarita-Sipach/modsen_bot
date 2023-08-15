import { UserModel } from "@models";
import { Parent } from "./abstract";
import { capitalize } from "@fn";
import { WeatherType } from "@types";
import { i18n } from "@i18n";
import { Cron } from "./cron";
import { bot } from "@bot";

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

	changeCity: string = '';
	city: string = '';
	time: string = ''
	cron: Cron<WeatherType> | null = null;
	status: boolean = false

	constructor(private readonly userId: number){
		super('https://api.openweathermap.org/data/2.5/weather', process.env.WEATHER_KEY as string);
		this.init()
	}

	async init(){
		const userInfo = await UserModel.findById(this.userId);

		const sendHTML = async(weatherInfo: WeatherType) => {
			bot.telegram.sendMessage(
				this.userId, 
				i18n.t('ru', 'weather.info', weatherInfo), 
				{parse_mode: 'HTML'}
			);
		}
		this.cron = new Cron(sendHTML);
		
		if(userInfo?.weatherStatus){
			this.status = userInfo?.weatherStatus;
			this.changeCity = this.city = userInfo?.city;
			this.time = userInfo?.time;
			const weatherInfo = await this.getWeatherInfo();
			
			this.cron.start(this.time, weatherInfo)
		}
	}

	async getWeatherInfo(){
		const weatherInfo: APIWeatherType = await this.getData(
			[
				['q', this.changeCity], 
				['appid', this.key], 
				['lang', 'ru'], 
				['units', 'metric']
			]
		);

		return {
			city: capitalize(this.changeCity),
			desc: capitalize(weatherInfo.weather[0].description),
			temp: weatherInfo.main.temp, 
			speed: weatherInfo.wind.speed
		}
	}

	async follow(newTime: string){
		this.cron?.cronId && this.cron?.stop()

		const weatherStatus = this.status = true;
		const time = this.time = newTime;
		const city = this.city = this.changeCity

		await UserModel.findOneAndUpdate(
			{_id: this.userId, weatherStatus: false}, 
			{weatherStatus: weatherStatus, city, time}
		);

		const weatherInfo = await this.getWeatherInfo();
		this.cron?.start(this.time, weatherInfo)
	}

	async unfollow () {

		const weatherStatus = this.status = false;
		const time = this.time = '';
		const city = this.city = '';

		await UserModel.findOneAndUpdate(
			{_id: this.userId, weatherStatus: true}, 
			{weatherStatus, time, city}
		);

		this.cron?.stop()
	}
}