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
		const coordinates: APICoordinatesType | Error = await this.getData(
			`${this.url}geoname`, 
			[
				['apikey', this.key], 
				['name', city]
			]
		);

		if(coordinates instanceof Error) return coordinates;
		if(coordinates.error) return new Error('Bad city');

		this.coordinates = coordinates; 
	}

	async getAllElements(placeKind: string){
			const {lon, lat} = this.coordinates;
			this.placeKind = placeKind

			const places: APIPlaceIdsType | Error = await this.getData(
				`${this.url}bbox`, 
				[
					['apikey', this.key], 
					['kinds', this.placeKind], 
					['lon_min', lon - 1], 
					['lat_min', lat - 1], 
					['lon_max', lon + 1], 
					['lat_max', lat + 1]]
			);

			if(places instanceof Error) return places;
			if(places.error) return new Error('Bad type');
			const placeIds = places.features
				.filter(({properties}) => properties.wikidata)
				.map(({properties}) => properties.xid);

			this.allElements = placeIds;
	}

	async getNewElement(){
		const index = this.getRandomPositiveInteger(this.allElements.length)
		const place: APIPlaceType | Error = await this.getData(`${this.url}xid/${this.allElements[index]}`, [['apikey', this.key]]);

		if(place instanceof Error) return place;
		if(place.error) return new Error('Bad place');

		return {
			title: place.name, 
			text: place.wikipedia_extracts.text, 
			link: place.wikipedia, 
			img: place?.preview?.source
		}
	}
};