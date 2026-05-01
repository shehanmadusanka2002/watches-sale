import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
export declare class ReviewsService {
    private reviewRepository;
    private productsService;
    private usersService;
    constructor(reviewRepository: Repository<Review>, productsService: ProductsService, usersService: UsersService);
    addReview(userId: number, productId: number, rating: number, comment: string): Promise<Review>;
    getProductReviews(productId: number): Promise<Review[]>;
    deleteReview(userId: number, reviewId: number): Promise<void>;
    findAll(): Promise<Review[]>;
}
