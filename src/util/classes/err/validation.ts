import { TelegrafContext } from "../../../types";
import { back } from "../../functions";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }

	sendError (ctx: TelegrafContext) {
		ctx.reply(this.message);
		return back(ctx)
	}
}