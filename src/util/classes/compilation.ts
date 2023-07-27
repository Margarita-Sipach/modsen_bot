import { Parent } from "./parent";

export class Compilation<T> extends Parent{
	protected allElements: T[];

	constructor(url: string, key: string){
		super(url, key)
		this.allElements = [];
	}

	protected getRandomPositiveInteger = (max: number) => Math.floor(Math.random() * max);

	protected async getAllElements(){}

	async getNewElement(){
		return {}
	}
}