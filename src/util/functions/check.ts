export const checkCity = (city: string) => {
	return Number(city)
}

export const checkTime = (time: string) => {
	return !/^(2[0-3]|[0-1]?[\d]):[0-5][\d]$/.test(time)
}