export interface OrganizationDto {
  id: string
  name: string
  description: string
  adminEmail: string
  logoUrl: string
  uniqueKey: string
  isActive: boolean
  adminId: string
  adminName: string
  createdAt: string
}

export interface CreateOrganizationDto {
  organizationName: string
  description?: string
  adminFirstName: string
  adminLastName: string
  adminDisplayName?: string
  adminEmail: string
  adminPhoneNumber: string
  logoFile?: File
  password: string
}

export interface CreatedOrganizationDto {
  id: string
  organizationName: string
  description: string
  logoUrl: string
  uniqueKey: string
  adminFirstName: string
  adminLastName: string
  adminDisplayName: string
  adminEmail: string
  createdAt: string
}

export interface UpdateOrganizationDto {
  name: string;
  description?: string;
  logo?: File; 
}