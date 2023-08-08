import { back } from "../../functions";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }

	async sendError (ctx: any) {
		await ctx.reply(this.message);
		return back(ctx)
	}
}