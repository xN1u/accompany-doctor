export interface LoginResult {
  openid: string
  sessionid: string
  userinfo: Userinfo
}

export interface Userinfo {
  admin_switch: number
  app_id: number
  area_id: number
  avatar: string
  avatar_url: string
  black_switch: number
  city: string
  createtime: number
  district: string
  expends: string
  id: number
  inviter_id: number
  invites: number
  mobile: string
  my_staff_id: number
  nickname: string
  openid: string
  orders: number
  orders_cancel: number
  orders_done: number
  province: string
  remark: string
  sell_income: string
  sell_money: string
  sell_outcash: string
  seller_id: number
  seller_switch: number
  seller_time: number
  sells: number
  updatetime: number
}

export interface UserInfoData {
  mine: Mine
  now: number
  staff: Staff
  statistic: Statistic
}

export interface Mine {
  _id: string
  admin_switch: number
  app_id: number
  area_id: number
  avatar: string
  avatar_url: string
  black_switch: number
  city: string
  createtime: number
  district: string
  expends: string
  id: number
  inviter_id: number
  invites: number
  mobile: string
  my_staff_id: number
  nickname: string
  openid: string
  orders: number
  orders_cancel: number
  orders_done: number
  province: string
  remark: string
  sell_income: string
  sell_money: string
  sell_outcash: string
  seller_id: number
  seller_switch: number
  seller_time: number
  sells: number
  updatetime: number
}

export interface Staff {
  age: number
  app_id: number
  area_id: number
  avatar: string
  avatar_url: string
  createtime: number
  id: number
  idcardnum: string
  idcards_images: string
  income: string
  income_master: string
  income_service: string
  master: string
  master_text: string
  master_uid: number
  mobile: string
  money: string
  nickname: string
  odmanar: string
  odmanar_text: string
  openid: string
  outcash: string
  papers_images: string
  realname: string
  remark: string
  sex: string
  sex_text: string
  status: string
  status_remark: string
  status_text: string
  status_time: number
  status_time_text: string
  stop_switch: number
  subs: number
  updatetime: number
  user_id: number
}

export interface Statistic {
  todos: number
  topays: number
}
