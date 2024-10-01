import { object } from "zod"
import { months, PaymentStatus } from "../../utils/constant"
import Payment from "../payment/payment.model"
import Post from "../post/post.model"
import Subscription from "../subscription/subscription.model"
import User from "../user/user.model"
import { objectId } from "../../utils/function"
import { IAdminOverview } from "./overview.interface"

const getAdminOverviewDataFromDB = async (query:any):Promise<IAdminOverview>=>{
  
  const currentYear = new Date().getFullYear();  
  const lastDateOfYear = new Date(currentYear, 11, 31); 
  const currentMonthNumber = new Date().getMonth()
  const payments= await Payment.find({createdAt:{$lte:lastDateOfYear}}) 


   const monthsPayments = months.map((month,monthNumber)=>{

   const monthPayments = payments.filter((payment) => new Date(payment.createdAt).getMonth() === monthNumber )
   return {
   month:month,
   payments:monthPayments,
   upcoming:new Date().getMonth()<monthNumber // Checking  upcoming month (if month number is getter than  current month number then true otherwise false)
   }
  }) 
 

  const monthsRevenue = monthsPayments.map(item=>(
    {
      month:item.month,
      total_revenue:item.payments.reduce((p,c)=>p+c.amount,0),
      upcoming:item.upcoming
    }
  ))

 
  
 const running_month_Revenue = monthsRevenue.find((_,monthNumber)=>monthNumber === currentMonthNumber)?.total_revenue||0
 

 const total_user = await User.countDocuments()
 const total_payment = await Payment.find({status:PaymentStatus.SUCCESS}).countDocuments()
 const total_post = await Post.countDocuments()
 const total_subscription  = await Subscription.countDocuments() 
 const total_revenue  = payments.reduce((p,c)=>p+c.amount,0)

  return {
    total_user,
    total_payment,
    total_revenue,
    total_subscription,
    total_post,
    running_month_Revenue,
    months_revenue:monthsRevenue
  }
}


const getCurrentUserOverviewDataFromDB = async (userId:string,query:any)=>{
  const user = await User.findById(userId).select('latest_subscription')

  // Getting all post of the user
  const posts = await  Post.find({author:objectId(userId)})
  const total_post = posts.length
  const total_earning = 0
  const latest_posts = posts.slice(-4,posts.length)
  
  const result = {

  }

  return {
    total_post,
    total_earning,
    latest_posts
  }
}

export const OverviewService = {
    getAdminOverviewDataFromDB,
    getCurrentUserOverviewDataFromDB
}