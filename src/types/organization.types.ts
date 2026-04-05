export interface OrganizationDto {
  id: string
  name: string
  description: string
  adminEmail: string
  logoUrl: string
  uniqueKey: string
  isActive: boolean
  createdAt: string
}

export interface CreateOrganizationDto {
  organizationName: string
  description?: string
  firstName?: string
  lastName?: string
  displayName?: string
  email: string
  logoFile?: File
  password?: string 
}

export interface UpdateOrganizationDto {
  name?: string;
  description?: string;
  logo?: File; 
}