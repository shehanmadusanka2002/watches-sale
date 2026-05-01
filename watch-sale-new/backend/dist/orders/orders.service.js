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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const users_service_1 = require("../users/users.service");
const cart_service_1 = require("../cart/cart.service");
const payments_service_1 = require("../payments/payments.service");
const mail_service_1 = require("../mail/mail.service");
const order_status_enum_1 = require("../enums/order-status.enum");
let OrdersService = class OrdersService {
    orderRepository;
    orderItemRepository;
    usersService;
    cartService;
    paymentsService;
    mailService;
    constructor(orderRepository, orderItemRepository, usersService, cartService, paymentsService, mailService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.usersService = usersService;
        this.cartService = cartService;
        this.paymentsService = paymentsService;
        this.mailService = mailService;
    }
    async createOrderFromCart(userId, paymentMethod, shippingDetails) {
        const user = await this.usersService.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const cart = await this.cartService.getCart(userId);
        if (!cart || cart.cartItems.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        const totalAmount = cart.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return this.orderRepository.manager.transaction(async (transactionalEntityManager) => {
            let order = transactionalEntityManager.create(order_entity_1.Order, {
                user,
                status: order_status_enum_1.OrderStatus.PENDING,
                ...shippingDetails,
            });
            order = await transactionalEntityManager.save(order_entity_1.Order, order);
            for (const item of cart.cartItems) {
                const product = await transactionalEntityManager.findOne('Product', { where: { id: item.product.id } });
                if (!product || product.stockQuantity < item.quantity) {
                    throw new common_1.BadRequestException(`Apologies, but the ${product?.name || 'requested timepiece'} is currently unavailable in this quantity. Please adjust your collection.`);
                }
                const orderItem = transactionalEntityManager.create(order_item_entity_1.OrderItem, {
                    order,
                    product,
                    quantity: item.quantity,
                    price: item.price,
                });
                await transactionalEntityManager.save(order_item_entity_1.OrderItem, orderItem);
                product.stockQuantity -= item.quantity;
                await transactionalEntityManager.save('Product', product);
            }
            await this.paymentsService.createPaymentInTransaction(transactionalEntityManager, order, paymentMethod, totalAmount);
            await this.cartService.clearCartInTransaction(transactionalEntityManager, userId);
            const finalOrder = (await transactionalEntityManager.findOne(order_entity_1.Order, {
                where: { id: order.id },
                relations: ['orderItems', 'orderItems.product', 'payment', 'user'],
            }));
            this.mailService.sendOrderConfirmation(finalOrder);
            return finalOrder;
        });
    }
    async createOrderWithItems(userId, paymentMethod, items, shippingDetails) {
        const user = await this.usersService.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (!items || items.length === 0) {
            throw new common_1.BadRequestException('No items provided for order');
        }
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return this.orderRepository.manager.transaction(async (transactionalEntityManager) => {
            let order = transactionalEntityManager.create(order_entity_1.Order, {
                user,
                status: order_status_enum_1.OrderStatus.PENDING,
                ...shippingDetails,
            });
            order = await transactionalEntityManager.save(order_entity_1.Order, order);
            for (const item of items) {
                const product = await transactionalEntityManager.findOne('Product', { where: { id: item.productId } });
                if (!product)
                    throw new common_1.NotFoundException(`Product ${item.productId} not found`);
                if (product.stockQuantity < item.quantity) {
                    throw new common_1.BadRequestException(`Apologies, but the ${product.name} is currently unavailable in this quantity. Please adjust your collection.`);
                }
                const orderItem = transactionalEntityManager.create(order_item_entity_1.OrderItem, {
                    order,
                    product,
                    quantity: item.quantity,
                    price: item.price,
                });
                await transactionalEntityManager.save(order_item_entity_1.OrderItem, orderItem);
                product.stockQuantity -= item.quantity;
                await transactionalEntityManager.save('Product', product);
            }
            await this.paymentsService.createPaymentInTransaction(transactionalEntityManager, order, paymentMethod, totalAmount);
            const finalOrder = (await transactionalEntityManager.findOne(order_entity_1.Order, {
                where: { id: order.id },
                relations: ['orderItems', 'orderItems.product', 'payment', 'user'],
            }));
            this.mailService.sendOrderConfirmation(finalOrder);
            return finalOrder;
        });
    }
    async getUserOrders(userId) {
        return this.orderRepository.find({
            where: { user: { id: userId } },
            relations: ['orderItems', 'orderItems.product', 'payment'],
            order: { orderDate: 'DESC' }
        });
    }
    async getAllOrders() {
        return this.orderRepository.find({
            relations: ['orderItems', 'orderItems.product', 'payment', 'user'],
            order: { orderDate: 'DESC' },
        });
    }
    async getOrderById(orderId) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['orderItems', 'orderItems.product', 'payment', 'user'],
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async updateOrderStatus(orderId, status) {
        const order = await this.getOrderById(orderId);
        order.status = status;
        await this.orderRepository.save(order);
        return this.getOrderById(orderId);
    }
    async deleteOrder(orderId) {
        const order = await this.getOrderById(orderId);
        await this.orderRepository.remove(order);
    }
    async getDashboardStats() {
        const orders = await this.orderRepository.find({ relations: ['payment', 'orderItems', 'orderItems.product'] });
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => {
            return sum + (order.payment?.amount || 0);
        }, 0);
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const revenueByMonth = orders.reduce((acc, order) => {
            const month = order.orderDate ? new Date(order.orderDate).toLocaleString('default', { month: 'short' }) : 'Unknown';
            acc[month] = (acc[month] || 0) + (order.payment?.amount || 0);
            return acc;
        }, {});
        const revenueByCategory = orders.reduce((acc, order) => {
            order.orderItems?.forEach(item => {
                const cat = item.product?.categoryType || 'Other';
                acc[cat] = (acc[cat] || 0) + (item.price * item.quantity);
            });
            return acc;
        }, {});
        return {
            totalOrders,
            totalRevenue,
            avgOrderValue,
            revenueByMonth,
            revenueByCategory,
        };
    }
    async getConsolidatedStats() {
        const [orders, users, products] = await Promise.all([
            this.orderRepository.find({ relations: ['payment'] }),
            this.usersService.findAllForAdmin(),
            this.orderRepository.manager.count('Product'),
        ]);
        const totalRevenue = orders.reduce((sum, order) => sum + (order.payment?.amount || 0), 0);
        return {
            totalRevenue,
            totalOrders: orders.length,
            totalCustomers: users.length,
            totalProducts: products,
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService,
        cart_service_1.CartService,
        payments_service_1.PaymentsService,
        mail_service_1.MailService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map