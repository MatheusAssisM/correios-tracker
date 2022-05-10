const VenomClient = require('./services/venomClient.js');
const CorreiosTracker = require('./services/correiosTracker.js');
const CorreiosClient = require('./services/correiosClient.js');
const MessageService = require('./services/message.js');
const OrderRepository = require('./repositories/order.js');
const cron = require('node-cron');
const VenomService = require('./services/venom.js');


async function main() {
    const venom = new VenomClient()
    const venomClient = await venom.getClient()
    const venomService = new VenomService(venomClient) 

    const messageService = new MessageService()
    const orderRepository = new OrderRepository()

    const correiosClient = new CorreiosClient()
    const correiosTracker = new CorreiosTracker(venomService, correiosClient, orderRepository, messageService)

    cron.schedule('*/20 * * * *', correiosTracker.checkOrder);
}


main()