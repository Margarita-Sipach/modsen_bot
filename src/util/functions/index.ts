export const getChatId = (ctx: any) => ctx.message?.from.id || ctx.callbackQuery?.from.id;
