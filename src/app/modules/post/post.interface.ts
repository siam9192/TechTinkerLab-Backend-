import { Types } from 'mongoose';

export interface IPost {
  title: string;
  content: string;
  category: string;
  thumbnail: string;
  images?: string[];
  tags?: string[];
  is_premium?: boolean;
  is_private?: string;
  total_earning?:number
  total_upvote?: number;
  total_downvote?: number;
  total_read?:number,
  total_reader?:number,
  total_gained_follower?:number,
  total_lost_follower?:number
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
