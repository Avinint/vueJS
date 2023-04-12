import { Ref } from "vue"

export default interface Link {
  label: string
  path: string
  icon?: string
  tag?: string
  sub_links?: Link[] | Ref
  sub_links_open?: boolean
  divider?: boolean
}
