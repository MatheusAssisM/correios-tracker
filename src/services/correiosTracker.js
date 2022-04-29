const trackingCodes = require('../helpers/trackingCodes.json')

class CorreiosTracker {
    constructor(venomClient, correiosClient, orderRepository) {
        this.venomClient = venomClient
        this.correiosClient = correiosClient
        this.orderRepository = orderRepository
    }

    checkOrder = async () => {
        let message = ""
        const orders = await this.orderRepository.getAll()
        for (const order of orders) {
            try {
                const code = order.code
                const objects = await this.getOrderObjects(code)
                const targetOrder = this.findObject(objects, code)
                const lastStatus = await this.getLastStatus(targetOrder, order)
                message += this.prepareMessage(lastStatus, order)
            } catch (error) {
                console.log(error.message)
                continue
            }
        }
        if (!message.length) {
            return
        }
        this.sendMessage(message)
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

    updateOrderStatus = async (order, status) => {

    }

    prepareMessage = (lastStatus, order) => {
        const { date, time } = this.prepareData(lastStatus.dtHrCriado)
        const address = this.prepareAddress(lastStatus.unidade)
        let message = `*Objeto*: ${order.name} - ${order.code}\n*Status*: ${lastStatus.descricao}\n*Local*: ${address}\n*Data*: ${date} as ${time}\n\n`
        return message
    }

    prepareData = (date) => {
        let dates = date.split('T')
        return {
            date: dates[0],
            time: dates[1]
        }
    }

    prepareAddress = (unity) => {
        if (Object.keys(unity.endereco).length !== 0) {
            return `${unity.endereco.cidade}`
        }
        return `${unity.nome}`
    }

    sendMessage = (message) => {
        const numbers = [
            '556185775929@c.us',
            '556181949859@c.us'
        ]
        numbers.forEach(number => {
            this.venomClient.sendText(number, message)
        })
    }

}

module.exports = CorreiosTracker