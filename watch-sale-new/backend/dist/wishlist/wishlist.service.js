"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wishlist_item_entity_1 = require("./entities/wishlist-item.entity");
const products_service_1 = require("../products/products.service");
const users_service_1 = require("../users/users.service");
let WishlistService = class WishlistService {
    wishlistRepository;
    productsService;
    usersService;
    constructor(wishlistRepository, productsService, usersService) {
        this.wishlistRepository = wishlistRepository;
        this.productsService = productsService;
        this.usersService = usersService;
    }
    async getWishlist(userId) {
        return this.wishlistRepository.find({
            where: { user: { id: userId } },
            relations: ['product', 'user'],
        });
    }
    async addItem(userId, productId) {
        const user = await this.usersService.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const product = await this.productsService.findOne(productId);
        const existingItem = await this.wishlistRepository.findOne({
            where: { user: { id: userId }, product: { id: productId } },
        });
        if (existingItem) {
            throw new common_1.ConflictException('Product is already in wishlist');
        }
        const newItem = this.wishlistRepository.create({
            user,
            product,
        });
        return this.wishlistRepository.save(newItem);
    }
    async removeItem(userId, itemId) {
        await this.wishlistRepository.delete({ id: itemId, user: { id: userId } });
    }
    async removeItemByProductId(userId, productId) {
        await this.wishlistRepository.delete({ user: { id: userId }, product: { id: productId } });
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wishlist_item_entity_1.WishlistItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        products_service_1.ProductsService,
        users_service_1.UsersService])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map