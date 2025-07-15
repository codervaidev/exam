export interface NavLink {
  title: string
  icon?: string
  link: string
}

export interface NavGroup {
  title: string
  icon?: string
  children: NavLink[]
}

export interface NavSectionTitle {
  heading: string
}

export type NavMenuItems = Array<NavLink | NavGroup | NavSectionTitle> 