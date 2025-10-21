export interface ReviewDto {
  id: string;
  userId: number;
  content: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}
