import { Parent } from "./parent";

export abstract class Compilation<T> extends Parent{
	protected allElements: T[] = [];

	constructor(url: string, key: string){
		super(url, key)
	}

	protected getRandomPositiveInteger = (max: number) => Math.floor(Math.random() * max);

	protected abstract getAllElements(param?: string):void

	abstract getNewElement(param?: string):Promise<T>
}