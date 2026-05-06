"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus[OrderStatus["PENDING"] = 0] = "PENDING";
    OrderStatus[OrderStatus["CONFIRMED"] = 1] = "CONFIRMED";
    OrderStatus[OrderStatus["SHIPPED"] = 2] = "SHIPPED";
    OrderStatus[OrderStatus["DELIVERED"] = 3] = "DELIVERED";
    OrderStatus[OrderStatus["CANCELLED"] = 4] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
//# sourceMappingURL=order-status.enum.js.map