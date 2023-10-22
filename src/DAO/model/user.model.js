import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true},
    password: String,
    age: Number,
    cart:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"carts",
    },
    role:{type:String,
    default:'user'},
     documents: [
        {
            name: String,
            reference: String,
        },
    ],
    last_connection: Date
});

export const userModel = mongoose.model('users', userSchema)