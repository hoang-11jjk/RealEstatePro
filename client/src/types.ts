export type PropertyType = 'Căn hộ' | 'Nhà phố' | 'Biệt thự' | 'Đất nền'
export type PropertyStatus = 'Bán' | 'Cho thuê'

export type Property = {
  id: number
  title: string
  price: number
  location: string
  type: PropertyType
  status: PropertyStatus
  beds: number
  baths: number
  area: number
  image: string
  description: string
  tags: string[]
  contactName: string
  contactPhone: string
  postedAt: string
  ownerEmail: string
}

export type ListingPayload = Omit<Property, 'id' | 'postedAt' | 'image' | 'tags'>

export type ListingDraft = {
  title: string
  price: number | string
  location: string
  type: PropertyType
  status: PropertyStatus
  beds?: number | string
  baths?: number | string
  area?: number | string
  description?: string
  contactName?: string
  contactPhone?: string
  image?: string
  ownerEmail?: string
  ownerName?: string
}
