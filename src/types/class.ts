export interface AnimalType {
	url: string, 
	photographer: string
}

export interface PlaceType {
	title: string,
	text: string,
	link: string,
	img: string
}

export interface WeatherType {
	city: string;
	desc: string;
	temp: number
	speed: number
}

export interface TaskType {
	title: string, 
	body: string,
	time: string
}

export type AnimalCommandsType = 'cat' | 'dog'