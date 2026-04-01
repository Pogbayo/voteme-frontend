export const Roles = {
  SuperAdmin: 'SuperAdmin',
  OrgAdmin: 'OrgAdmin',
  Voter: 'Voter',
} as const

export const OrgRole = {
  Member : 'Member',
  Admin : 'Admin',
  Owner : 'Owner',
}
export type Role = typeof Roles[keyof typeof Roles ]
export type OrgRoleType = typeof OrgRole[keyof typeof OrgRole];