export type Tag = {
  id: string
  name: string
  group_id: string
  oligo: string
  createdAt: Date
  updatedAt?: Date
}

export type OntPoolItem = {
  id: string
  name: string
  createdAt: Date
  updatedAt?: Date
  tag?: Tag
  concentration?: number
  volume?: number
  kit_barcode?: string
  insert_size?: number
}

export type PacbioPoolItem = {
  id: string
  name: string
  createdAt: Date
  tag: Tag
  updatedAt?: Date
  tag?: Tag
  concentration?: number
  volume?: number
  template_prep_kit_box_barcode?: string
  insert_size?: number
}

export type Pool<T = PacbioPoolItem | OntPoolItem> = {
  id: string
  name: string
  items: T[]
  createdAt: Date
  updatedAt?: Date
}
