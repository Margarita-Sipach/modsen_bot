import { Parent } from "./parent";

export class Weather extends Parent {
	city: string

	constructor(){
		super('https://api.openweathermap.org/data/2.5/weather', process.env.WEATHER_KEY as string)
		this.city = ''
	}

	async getCityWeather(city?: string){
		city && (this.city = city)

		const json = await this.getData(this.url, [['q', this.city], ['appid', this.key], ['lang', 'ru']]);
		const [firstLetter, ...rest] = json.weather[0].description
		return {desc: `${firstLetter.toUpperCase()}${rest}`, temp: json.main.temp, speed: json.wind.speed}
	}
}