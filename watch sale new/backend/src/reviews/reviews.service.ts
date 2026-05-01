import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private productsService: ProductsService,
    private usersService: UsersService,
  ) {}

  async addReview(userId: number, productId: number, rating: number, comment: string): Promise<Review> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const product = await this.productsService.findOne(productId);

    const review = this.reviewRepository.create({
      user,
      product,
      rating,
      comment,
    });

    return this.reviewRepository.save(review);
  }

  async getProductReviews(productId: number): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { product: { id: productId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async deleteReview(userId: number, reviewId: number): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, user: { id: userId } }
    });
    if (!review) throw new NotFoundException('Review not found or unauthorized');

    await this.reviewRepository.delete(reviewId);
  }

  async findAll(): Promise<Review[]> {
    return this.reviewRepository.find({
      relations: ['user', 'product'],
      order: { createdAt: 'DESC' },
    });
  }
}
