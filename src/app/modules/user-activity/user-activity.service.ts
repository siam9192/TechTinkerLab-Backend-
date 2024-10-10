// import { IUserActivity } from "./user-activity.interface";

import QueryBuilder from "../../middlewares/QueryBuilder"
import { IActivity } from "../auth/auth.interface"
import UserActivity from "./user-activity.model"

const createUserActivityIntoDB = async (type:'Login'|'Logout',payload:IActivity)=>{
 const data = {
      type,
      ...payload
 }
 return await UserActivity.create(data)
}


const getUsersActivity = async (query:any)=>{
    const result = await new QueryBuilder(UserActivity.find(),query).sort().paginate().populate('user').get()

    const meta = await new QueryBuilder(UserActivity.find(),query).find().getMeta()

    return {
        result,meta
    }
}




export const UserActivityService = {
    createUserActivityIntoDB,
    getUsersActivity
}