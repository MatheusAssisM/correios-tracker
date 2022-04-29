const Order = require('../models/order');

class OrderRepository {
    model = Order

    save = (order) => {
        return this.model.create(order)
    }

    getByCode = (code) => {
        return this.model.findOne({ where: { code } })
    }

    getAll = () => {
        return this.model.findAll()
    }

    update = (id, data) => {
        return this.model.update(data, { where: { id } })
    }
}

module.exports = OrderRepository