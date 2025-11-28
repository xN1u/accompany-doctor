export interface HomeDataResult {
  area: Area
  cfg: Cfg
  mine: Mine
}

export interface Area {
  app_id: number
  city: string
  createtime: number
  deletetime: null
  district: string
  id: number
  money: string
  money_in: string
  money_outcash: string
  name: string
  odmode: string
  odmode_text: string
  openid: string
  plat_in: string
  plat_profit: string
  profit: number
  province: string
  remark: string
  seller_bind: number
  seller_reg: string
  seller_reg_text: string
  staff_reg: string
  staff_reg_text: string
  staff_team: string
  staff_team_intro: string
  staff_team_text: string
  tax_master: number
  tax_plat: number
  tax_seller: number
  tels_json: string
  updatetime: number
  use_switch: number
  user_id: number
  user_info: string
  users: number
  weigh: number
  weixin_image: string
}

export interface Cfg {
  createtime: number
  id: number
  logo: string
  logo_url: string
  logob: string
  logob_url: string
  mpappid: string
  name: string
  nt_order_new: string
  outcash_channel: string
  outcash_max: string
  outcash_min: string
  outcash_sp: number
  page_fw: string
  page_qa: string
  page_seller: string
  page_xy: string
  pay_exp: number
  qmap_key: string
  share_image: string
  share_image_url: string
  share_poster: string
  share_poster_url: string
  share_title: string
  updatetime: number
  vpkey: string
  wxapp_id: string
  wxapp_secret: string
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
