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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const payment_method_enum_1 = require("../enums/payment-method.enum");
const order_status_enum_1 = require("../enums/order-status.enum");
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    getAllOrders() {
        return this.ordersService.getAllOrders();
    }
    getAdminStats() {
        return this.ordersService.getConsolidatedStats();
    }
    getStats() {
        return this.ordersService.getDashboardStats();
    }
    checkout(userId, paymentMethod, items, shippingDetails) {
        if (items && items.length > 0) {
            return this.ordersService.createOrderWithItems(+userId, paymentMethod, items, shippingDetails);
        }
        return this.ordersService.createOrderFromCart(+userId, paymentMethod, shippingDetails);
    }
    getUserOrders(userId) {
        const parsedUserId = Number(userId);
        if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
            throw new common_1.BadRequestException('Invalid user id');
        }
        return this.ordersService.getUserOrders(parsedUserId);
    }
    updateStatus(id, status) {
        const parsedOrderId = Number(id);
        if (!Number.isInteger(parsedOrderId) || parsedOrderId <= 0) {
            throw new common_1.BadRequestException('Invalid order id');
        }
        const statusValue = Number(status);
        if (isNaN(statusValue) || !Object.values(order_status_enum_1.OrderStatus).includes(statusValue)) {
            throw new common_1.BadRequestException('Invalid order status');
        }
        return this.ordersService.updateOrderStatus(parsedOrderId, statusValue);
    }
    getOrderById(id) {
        const parsedOrderId = Number(id);
        if (!Number.isInteger(parsedOrderId) || parsedOrderId <= 0) {
            throw new common_1.BadRequestException('Invalid order id');
        }
        return this.ordersService.getOrderById(parsedOrderId);
    }
    deleteOrder(id) {
        const parsedOrderId = Number(id);
        if (!Number.isInteger(parsedOrderId) || parsedOrderId <= 0) {
            throw new common_1.BadRequestException('Invalid order id');
        }
        return this.ordersService.deleteOrder(parsedOrderId);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.Get)('admin-stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getAdminStats", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)(':userId/checkout'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)('paymentMethod')),
    __param(2, (0, common_1.Body)('items')),
    __param(3, (0, common_1.Body)('shippingDetails')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "checkout", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getUserOrders", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "deleteOrder", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map