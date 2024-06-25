export type PostType = {
  id: number
  created_at: string
  avatar: string
  content: string
  content_imgs: string
  tag_val: string
  userName: string
  comment: {count: number}[]
  like: {like_val: number}[]
  page_views: {views: number}[]
  
}