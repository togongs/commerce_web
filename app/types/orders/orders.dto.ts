export namespace OrdersDto {
  export interface OrderItemResponse {
    id: number
    productId: number
    quantity: number
    price: number
    amount: number
  }
  export interface OrdersResponse {
    id: number
    userId: string
    orderItemIds: string
    receiver: string
    addresss: string
    phoneNumber: string
    createdAt: string
    status: number
  }
}
