import { TelegrafContext } from "@types";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }

	sendError (ctx: TelegrafContext) {
		ctx.reply(this.message);
		ctx.wizard.back();
		return ctx.wizard.next();
	}
}