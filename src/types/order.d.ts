import type { ServiceClient } from './service'

export interface OrderBodyData {
  /**
   * 陪跑收件人信息
   */
  address?: Address
  /**
   * 就诊人
   */
  client?: Partial<ServiceClient>
  /**
   * 服务需求
   */
  demand: string
  /**
   * 医院id
   */
  hospital_id: number
  /**
   * 医院名字
   */
  hospital_name: string
  /**
   * 接送地址
   */
  receiveAddress: string
  /**
   * 服务code
   */
  service_code: string
  /**
   * 服务id
   */
  service_id: number
  /**
   * 服务名称
   */
  service_name: string
  /**
   * 服务类型
   */
  service_stype: string
  /**
   * 服务开始时间戳
   */
  starttime: number | undefined
  /**
   * 电话
   */
  tel: string
}

export interface Address {
  cityName: string
  countyName: string
  detailInfo: string
  userName: string
}

export interface OrderData {
  _exp_time?: number
  address?: Address
  area_name: string
  code_url: string
  demand: string
  hospital_id: number
  hospital_name: string
  order_start_time: number
  other: string
  out_trade_no: string
  paidPrice: string
  price: string
  receiveAddress: string
  service_code: string
  service_id: number
  service_logo_image_url: string
  service_name: string
  service_state: string
  service_stype: string
  starttime: number
  tel: string
  time_end: number
  trade_state: string
  transaction_id: string
  uid: string
}

export interface OrderDetailData {
  pay_time?: number
  area_name: string
  client_name?: string
  client_mobile?: string
  client_sex?: string
  code_url: string
  demand: string
  hospital_id: number
  hospital_name: string
  order_start_time: number
  other: string
  out_trade_no: string
  paidPrice: string
  price: string
  receiveAddress: string
  service_code: string
  service_id: number
  service_logo_image_url: string
  service_name: string
  service_state: string
  service_stype: string
  starttime: number
  tel: string
  time_end: number
  trade_state: string
  transaction_id: string
  uid: string
  _exp_time?: number
  _staff: Staff
  address: workAddress
}

interface workAddress extends Address {
  address: any
}

export interface Staff {
  age: number
  avatar: string
  avatar_url: string
  id: number
  master_text: string
  mobile: string
  nickname: string
  odmanar_text: string
  sex: string
  sex_text: string
  status_text: string
  status_time_text: string
  user_id: number
}
