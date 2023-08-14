import { Compilation } from "./compilation";
import { PlaceType } from "../../types/class";

interface APIError{ 
	status?: string,
	error?: string
}
interface APICoordinatesType extends APIError{
	lon: number,
	lat: number
}

interface APIPlaceIdsType extends APIError{
	features: Array<{ 
		properties: {
			xid : string,
			wikidata: string
		}
	}>
}

interface APIPlaceType extends APIError{
	name: string, 
	wikipedia_extracts: { 
		text: string
	},
	wikipedia: string,
	preview: { 
		source: string 
	} 
}

export class Place extends Compilation<PlaceType | string>{

	private coordinates: APICoordinatesType = {} as APICoordinatesType
	private placeKind: string = ''

	constructor(){
		super(`http://api.opentripmap.com/0.1/ru/places/`, process.env.PLACE_KEY as string);
	}

	async setCoordinates(city: string){
		const coordinates: APICoordinatesType = await this.getData(
			[
				['apikey', this.key], 
				['name', city]
			],
			`${this.url}geoname`
		);
		if(coordinates.status === 'NOT_FOUND') throw new Error()
		this.coordinates = coordinates; 
	}

	async getAllElements(placeKind: string){
			const {lon, lat} = this.coordinates;
			this.placeKind = placeKind

			const places: APIPlaceIdsType = await this.getData(
				[
					['apikey', this.key], 
					['kinds', this.placeKind], 
					['lon_min', lon - 0.5], 
					['lat_min', lat - 0.5], 
					['lon_max', lon + 0.5], 
					['lat_max', lat + 0.5]
				],
				`${this.url}bbox`, 
			);

			if(places.status === 'NOT_FOUND') throw new Error()

			const placeIds = places.features
				.filter(({properties}) => properties.wikidata)
				.map(({properties}) => properties.xid);

			this.allElements = placeIds;
	}

	async getNewElement(){
		const index = this.getRandomPositiveInteger(this.allElements.length)
		const place: APIPlaceType = await this.getData([['apikey', this.key]], `${this.url}xid/${this.allElements[index]}`);

		if(place.status === 'NOT_FOUND') throw new Error()

		return {
			title: place.name, 
			text: place.wikipedia_extracts.text, 
			link: place.wikipedia, 
			img: place?.preview?.source
		}
	}
};