import { type } from "os";
import { Compilation } from "./compilation";
import { AnimalType } from "../../types/class";

export class Animal extends Compilation<AnimalType>{

	constructor(animal: string){
		super(`http://api.pexels.com/v1/search?query=${animal}`, process.env.ANIMALS_KEY as string);
		this.getAllElements();
	}

	protected async getAllElements(){
		const data = await this.getData(this.url, [['page', 1], ['per_page', 100]], this.key)
		type Info = {
			src: {large: string};
			photographer: string;
		}
		const photos = (await data).photos.map(({src, photographer}: Info) => ({url: src.large, photographer}));
		this.allElements = photos;
	}
	
	async getNewElement(){
		const index = this.getRandomPositiveInteger(this.allElements.length)
		return this.allElements[index]
	}
}