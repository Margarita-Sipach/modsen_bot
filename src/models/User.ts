import mongoose from "mongoose";
import { boolean } from "webidl-conversions";

const UserShema = new mongoose.Schema({
	_id: {type: Number, require: true},
	city: {type: String},
	weatherStatus: {type: Boolean, require: false},
	time: {type: String}
})

export const User = mongoose.model('User', UserShema);