export const checkCity = async(ctx: any) => {
		return Number(await ctx?.message?.text)
}