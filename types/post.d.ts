export type PostListType = {
  id: number
  created_at: string
  avatar: string
  content: string
  content_imgs?: string
  tag_val: string
  userName: string
  comment?: {count: number}[]
  like?: {like_val: number}[]
  page_views?: {views: number}[]
}

export type PostDetailType = {
  id: number
  created_at: string
  avatar: string
  content: string
  content_imgs?: string
  tag_val: string
  userName: string
  like?: {
    like_val: number
    likers: string
  }[]
  page_views?: {views: number}[]
  comment?: {
    id: number
    created_at: string
    commentator: string
    responder: string
    comment_content: string
    reply_content: string
    post_id: number,
    reply: {
      comment_id: number
      commentator: string
      created_at: string
      id: number
      reply_content: string
      responder: string
    }[]
  }[]
}