export interface AreasResult {
  areas: Area[]
  now: number
}

export interface Area {
  id: number
  name: string
  odmode_text: string
  seller_reg_text: string
  staff_reg_text: string
  staff_team_text: string
}
