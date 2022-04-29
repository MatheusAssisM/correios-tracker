const VenomClient = require('./services/venomClient.js');
const CorreiosTracker = require('./services/correiosTracker.js');
const CorreiosClient = require('./services/correiosClient.js');
const OrderRepository = require('./repositories/order.js');
const cron = require('node-cron');


async function main() {
    // let venomClient = {}
    const venom = new VenomClient()
    const venomClient = await venom.getClient()

    const orderRepository = new OrderRepository()

    const correiosClient = new CorreiosClient()
    const correiosTracker = new CorreiosTracker(venomClient, correiosClient, orderRepository)

    // await correiosTracker.checkOrder()

    cron.schedule('0 * * * *', correiosTracker.checkOrder);
}


main()