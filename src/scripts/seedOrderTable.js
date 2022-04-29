const OrderRepository = require("../repositories/order");

const trackingCodes = require("../helpers/trackingCodes.json");

const orderRepository = new OrderRepository();

trackingCodes.forEach(order => {
    orderRepository.save(order)
})
