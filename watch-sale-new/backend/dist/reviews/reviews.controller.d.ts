import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    getAllReviews(): Promise<import("./entities/review.entity").Review[]>;
    getProductReviews(productId: string): Promise<import("./entities/review.entity").Review[]>;
    addReview(userId: string, productId: string, rating: number, comment: string): Promise<import("./entities/review.entity").Review>;
    deleteReview(userId: string, reviewId: string): Promise<void>;
}
