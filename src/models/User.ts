import mongoose from "mongoose";
import { boolean } from "webidl-conversions";

const UserShema = new mongoose.Schema({
	_id: {type: Number, require: true},
	city: {type: String},
	weatherStatus: {type: Boolean, require: false},
	time: {type: String},
	tasks: [{type: mongoose.Schema.Types.ObjectId, ref: "Task"}]
})

export const UserModel = mongoose.model('User', UserShema);