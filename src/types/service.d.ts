export interface ServiceResult {
  hospitals: ServiceHospital[]
  my_staff: null
  now: number
  service: Service
}

export interface ServiceHospital {
  id: number
  name: string
  service_id: number
  service_price: string
}

export interface Service {
  admin_id: number
  app_id: number
  code: string
  content: string
  createtime: number
  deletetime: null
  icon_image: string
  icon_image_url: string
  id: number
  info: string
  intro: string
  logo_image: string
  logo_image_url: string
  name: string
  price: string
  priceo: string
  stype: string
  stype_text: string
  tags: string
  updatetime: number
  use_switch: number
  weigh: number
}

export interface ServiceClientResult {
  clients: ServiceClient[]
}

export interface ServiceClient {
  age: number
  app_id: number
  createtime: number
  id: number
  idcard: string
  mobile: string
  name: string
  openid: string
  sex: number
  user_id: number
}
