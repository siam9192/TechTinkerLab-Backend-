import { months } from '../../utils/constant';

type TMonthRevenue = {
  month: string;
  total_revenue: number;
  upcoming: boolean;
};

export type TMonthData = {
  month:string,
  posts:number,
  revenue:number,
  payments:number,
  user_activities:number,
  upcoming:boolean
}

export interface IAdminOverview {
  total_user: number;
  total_payment: number;
  total_revenue: number;
  total_subscription: number;
  total_post: number;
  running_month_revenue: number;
  monthsData:TMonthData[],
}
