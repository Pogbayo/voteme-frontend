export const Roles = {
  SuperAdmin: 'SuperAdmin',
  OrgAdmin: 'OrgAdmin',
  Voter: 'Voter',
} as const

export const OrgRole = {
  Member : 0,
  Admin : 1,
  Owner : 2,
}
export type Role = typeof Roles[keyof typeof Roles ]
export type OrgRoleType = typeof OrgRole[keyof typeof OrgRole];