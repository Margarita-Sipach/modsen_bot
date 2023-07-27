import axios from "axios";

export class Parent{
	protected readonly url: string;
	protected readonly key: string;

	constructor(url: string, key: string){
		this.url = url;
		this.key = key;
	}

	protected async getData(url: string, query: (string | number)[][] = [], auth: string = ''){
		const fullQuery = '?' + query.reduce((acc, item) => [...acc, `${item[0]}=${item[1]}`], []).join('&');
		const props = auth ? {headers: { Accept: 'application/json', Authorization: auth },} : {};
		const res = await axios.get(`${url}${fullQuery}`, props);
		return await res.data;
	}
}