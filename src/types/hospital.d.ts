export interface HospitalDataResult {
  hospitals: HospitalData[]
  my_staff: MyStaff
  nav2s: Nav[]
  navs: Nav[]
  now: number
  slides: Slide[]
}

export interface HospitalData {
  avatar: string
  avatar_url: string
  id: number
  intro: string
  label: string
  name: string
  rank: string
}

export interface MyStaff {
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
}

export interface Nav {
  cat_text: string
  id: number
  pic_image: string
  pic_image_url: string
  stype: string
  stype_link: string
  stype_text: string
  tcolor: string
  title: string
}

export interface Slide {
  id: number
  pic_image: string
  pic_image_url: string
  stype: string
  stype_link: string
  stype_text: string
  title: string
}

export interface HospitalDetail {
  hospital: HospitalDetailData
  now: number
  services: HospitalService[]
}

export interface HospitalDetailData {
  address: string
  admin_id: number
  app_id: number
  area_id: number
  avatar: string
  avatar_url: string
  city: string
  createtime: number
  deletetime: null
  district: string
  id: number
  intro: string
  label: string
  lat: number
  lng: number
  name: string
  province: string
  rank: string
  service: string
  updatetime: number
  use_switch: number
  weigh: number
}

export interface HospitalService {
  code: string
  icon_image: string
  icon_image_url: string
  id: number
  intro: string
  logo_image: string
  logo_image_url: string
  name: string
  price: string
  priceo: string
  stype: string
  stype_text: string
  use_switch: number
}
