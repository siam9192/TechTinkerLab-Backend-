import { months } from "../../utils/constant"

type TMonthRevenue = {
  month:typeof months[],
  revenue:number,
  upcoming:boolean
}

export interface IAdminOverview {
    total_user:number,
    total_payment:number,
    total_revenue:number,
    total_subscription:number,
    total_post:number,
    running_month_revenue:number,
    months_revenue:TMonthRevenue[]
}