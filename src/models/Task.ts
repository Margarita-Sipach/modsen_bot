import mongoose from 'mongoose';

const TaskShema = new mongoose.Schema({
  title: { type: String, require: true },
  body: { type: String, require: true },
  status: { type: Boolean, default: false },
  time: { type: Date, default: null },
});

export const TaskModel = mongoose.model('Task', TaskShema);
