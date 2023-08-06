import axios from "axios";

export abstract class Parent{

	constructor(
		protected readonly url: string, 
		protected readonly key: string
	){}

	protected async getData<T>(query: (string | number)[][] = [], url: string = this.url): Promise<T | Error>{
		try{
			const fullQuery = '?' + query.reduce((acc, item) => [...acc, `${item[0]}=${item[1]}`], []).join('&');
			const props = this.key ? {headers: { Accept: 'application/json', Authorization: this.key },} : {};
			const res = await axios.get(`${url}${fullQuery}`, props);
			return await res.data;
		}catch{
			return new Error("Bad request");
		}
	}
}