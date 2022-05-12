const subscribersNumbers = require('../helpers/clientNumbers.json')

class CorreiosTracker {
    constructor(venomService, correiosClient, orderRepository, messageService) {
        this.venomService = venomService
        this.correiosClient = correiosClient
        this.orderRepository = orderRepository
        this.messageService = messageService
    }

    checkOrder = async () => {
        const orders = await this.orderRepository.getAll()
        try {
            let messageList = await this.checkOrderStatus(orders)
            if (!messageList.length) {
                return
            }
            const message = this.messageService.buildMessageString(messageList)
            this.venomService.sendMessageForSubscribers(message)
        } catch (error) {
            this.venomService.notifyError()
            return
        }

    }

    checkOrderStatus = async (orders) => {
        let messageList = []
        for (const order of orders) {
            try {
                const code = order.code
                const objects = await this.getOrderObjects(code)
                const targetOrder = this.findObject(objects, code)
                const lastStatus = await this.getLastStatus(targetOrder, order)
                messageList.push(this.messageService.prepareMessage(lastStatus, order))
            } catch (error) {
                console.log(error.message)
                continue
            }
        }
        return messageList
    }

    getOrderObjects = async (code) => {
        const data = await this.correiosClient.track(code)
        const objects = data.objetos
        if (!objects) {
            throw new Error('Error getting order objects')
        }
        return objects
    }

    findObject = (objects, target) => {
        return objects.find(object => object.codObjeto === target)
    }

    getLastStatus = async (targetOrder, order) => {
        const events = targetOrder.eventos
        if (!events) {
            throw new Error('Error getting order events')
        }

        const eventsQuantity = events.length
        if (order.statusQuantity === eventsQuantity) {
            throw new Error('Dont need to update order')
        }

        const lastStatus = events[0]
        this.orderRepository.update(order.id, { statusQuantity: eventsQuantity })
        return lastStatus
    }
}

module.exports = CorreiosTracker