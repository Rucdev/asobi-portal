import { ReviewDto } from './ReviewDto';

export interface GameDto {
  id: string;
  title: string;
  url: string;
  tags: string[];
  creatorId: number;
  reviews: ReviewDto[];
  averageRating: number | null;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}
