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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shopping_cart_entity_1 = require("./entities/shopping-cart.entity");
const cart_item_entity_1 = require("./entities/cart-item.entity");
const products_service_1 = require("../products/products.service");
const users_service_1 = require("../users/users.service");
let CartService = class CartService {
    cartRepository;
    cartItemRepository;
    productsService;
    usersService;
    constructor(cartRepository, cartItemRepository, productsService, usersService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productsService = productsService;
        this.usersService = usersService;
    }
    async getCart(userId) {
        let cart = await this.cartRepository.findOne({
            where: { user: { id: userId } },
            relations: ['cartItems', 'cartItems.product', 'user'],
        });
        if (!cart) {
            const user = await this.usersService.findById(userId);
            if (!user)
                throw new common_1.NotFoundException('User not found');
            cart = this.cartRepository.create({ user, cartItems: [] });
            await this.cartRepository.save(cart);
        }
        return cart;
    }
    async addItem(userId, productId, quantity) {
        const cart = await this.getCart(userId);
        const product = await this.productsService.findOne(productId);
        const existingItem = cart.cartItems.find(item => item.product.id === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
            await this.cartItemRepository.save(existingItem);
        }
        else {
            const newItem = this.cartItemRepository.create({
                cart,
                product,
                quantity,
                price: product.price,
            });
            await this.cartItemRepository.save(newItem);
        }
        return this.getCart(userId);
    }
    async removeItem(userId, itemId) {
        const cart = await this.getCart(userId);
        await this.cartItemRepository.delete({ id: itemId, cart: { id: cart.id } });
        return this.getCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.getCart(userId);
        await this.cartItemRepository.delete({ cart: { id: cart.id } });
    }
    async clearCartInTransaction(manager, userId) {
        const cart = await this.getCart(userId);
        await manager.delete(cart_item_entity_1.CartItem, { cart: { id: cart.id } });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shopping_cart_entity_1.ShoppingCart)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        products_service_1.ProductsService,
        users_service_1.UsersService])
], CartService);
//# sourceMappingURL=cart.service.js.map