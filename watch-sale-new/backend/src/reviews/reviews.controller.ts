import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  getAllReviews() {
    return this.reviewsService.findAll();
  }

  @Get('product/:productId')
  getProductReviews(@Param('productId') productId: string) {
    return this.reviewsService.getProductReviews(+productId);
  }

  @Post(':userId/product/:productId')
  addReview(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body('rating') rating: number,
    @Body('comment') comment: string,
    @Body('imageUrl') imageUrl?: string,
  ) {
    return this.reviewsService.addReview(+userId, +productId, rating, comment, imageUrl);
  }

  @Delete(':userId/:reviewId')
  deleteReview(
    @Param('userId') userId: string,
    @Param('reviewId') reviewId: string,
  ) {
    return this.reviewsService.deleteReview(+userId, +reviewId);
  }

  @Delete(':reviewId')
  adminDeleteReview(@Param('reviewId') reviewId: string) {
    return this.reviewsService.deleteReviewAdmin(+reviewId);
  }
}
