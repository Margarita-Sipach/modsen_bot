import { getUserMessage } from "@fn"
import { TelegrafContext } from "@types"

export const checkCity = (city: string) => {
	return Number(city)
}

export const checkTime = (time: string) => {
	return !/^(2[0-3]|[0-1]?[\d]):[0-5][\d]$/.test(time)
}

export const checkNumber = (number: string | number, length: number) => {
	number = +number
	return (!number && number !== 0) || +number < 0 || +number >= length
}

export const checkExit = (ctx: TelegrafContext) => getUserMessage(ctx) === "/exit"