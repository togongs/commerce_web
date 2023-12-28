export namespace CommentsDto {
  export interface Response {
    id: number
    userId: string
    orderItemId: number
    rate: number
    contents: string
    images: string
    updatedAt: string
  }
}
