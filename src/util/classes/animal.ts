import { Compilation } from "./abstract";
import { AnimalType } from "@types";

interface APIType{
	photos: Array<{
		photographer: string,
		src: {
			large: string
		}
	}>
}

export class Animal extends Compilation<AnimalType>{

	constructor(animal: string){
		super(`http://api.pexels.com/v1/search?query=${animal}`, process.env.ANIMALS_KEY as string);
		this.getAllElements();
	}

	protected async getAllElements(){
		const data: APIType = await this.getData([['page', 1], ['per_page', 20]]);

		const photos = data.photos.map(({src, photographer}) => ({url: src.large, photographer}));
		this.allElements = photos;
	}
	
	async getNewElement(){
		!this.allElements.length && (await this.getAllElements())
		const index = this.getRandomPositiveInteger(this.allElements.length)
		return this.allElements[index]
	}
}