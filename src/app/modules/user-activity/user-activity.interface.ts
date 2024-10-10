import { Types } from "mongoose";

  

export interface IUserActivity {
    type:'Login'|'Logout'
    browser: string;
    ip_address?: string;
    user:Types.ObjectId
  };
  
