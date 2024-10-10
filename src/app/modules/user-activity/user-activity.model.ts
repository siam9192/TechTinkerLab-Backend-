import { model, Schema } from "mongoose";
import { IUserActivity } from "./user-activity.interface";



const UserActivitySchema = new Schema<IUserActivity>({
  type: { 
    type: String, 
    enum: ['Login', 'Logout'], 
    required: true 
  },
  browser: { type: String ,required:true} ,// Optional field
  ip_address: { type: String,default:null },
  user:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  }
},
{
timestamps:true
}
);

const UserActivity = model('UserActivity', UserActivitySchema);

export default UserActivity
