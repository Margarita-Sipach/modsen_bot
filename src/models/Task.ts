import mongoose from "mongoose";
import { boolean } from "webidl-conversions";

const TaskShema = new mongoose.Schema({
	title: {type: String, require: true},
	body: {type: String, require: true},
	status: {type: Boolean},
	time: {type: String}
})

export const TaskModel = mongoose.model('Task', TaskShema);