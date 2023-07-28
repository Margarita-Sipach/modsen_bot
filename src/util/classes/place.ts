import { Compilation } from "./compilation";
import { PlaceType } from "../../types/class";

export class Place extends Compilation<any>{
	city: string;

	constructor(){
		super(`http://api.opentripmap.com/0.1/ru/places/`, process.env.PLACE_KEY as string);
		this.city = '';
	}

	async getAllElements(place: string){
		const {lon, lat} = await this.getData(`${this.url}geoname`, [['apikey', this.key], ['name', place]]);
		const placeIds = (await this.getData(`${this.url}bbox`, [['apikey', this.key], ['lon_min', lon - 1], ['lat_min', lat - 1], ['lon_max', lon + 1], ['lat_max', lat + 1]])).features.map(({id}: {id: string}) => id);
		this.allElements = placeIds
	}

	async getNewElement(city: string){
		city && (this.city = city);
		await this.getAllElements(this.city);
		const index = this.getRandomPositiveInteger(this.allElements.length)
		const place = await this.getData(`${this.url}xid/${this.allElements[index]}`, [['apikey', this.key]]);
		return {
			title: place.name, 
			text: place.wikipedia_extracts.text, 
			link: place.wikipedia, 
			img: place.preview.source
		}
	}
};