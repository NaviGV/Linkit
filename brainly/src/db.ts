import mongoose from "mongoose";
import { Schema, model } from "mongoose";

import dotenv from 'dotenv';
dotenv.config();


if (!process.env.MONGODB_URL) {
  throw new Error("MONGODB_URL is not defined in environment variables.");
}

mongoose.connect(process.env.MONGODB_URL, {
    socketTimeoutMS: 45000,  
    connectTimeoutMS: 45000, 
  });
  

const UserSchema = new Schema({
 username:{type:String,unique:true},
 password:{type:String}

}
)

export const UserModel = model( "User",UserSchema);

const ContentSchema = new Schema({
    title:{type:String, required: true},
    link:{type:String, required: true},
    type:{type:String, required: true},
    tags:[{type:mongoose.Types.ObjectId, ref : 'Tag'}],
    userId:{type:mongoose.Types.ObjectId, ref : 'User',required:true}
   
   }
   )

export const ContentModel = model("Content",ContentSchema)



const LinkSchema = new Schema({
    hash:{type:String},
    
    userId:{type:mongoose.Types.ObjectId, ref : 'User',required:true, unique:true},
   
    
   
   }
   )

export const LinkModel = model("Link",LinkSchema)

