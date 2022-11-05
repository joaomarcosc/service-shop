import mongoose, { Schema } from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: { require: true, type: String },
  email: { require: true, type: String },
  password: { require: true, type: String },
})

export const User = mongoose.model('User', userSchema);