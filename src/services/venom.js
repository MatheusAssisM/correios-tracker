const clientNumbers = require('../helpers/clientNumbers.json')

class VenomService {
    constructor(venomClient) {
        this.venomClient = venomClient
        this.subscribersNumbers = clientNumbers.subscribers
        this.reportNumbers = clientNumbers.reports
    }

    sendMessageForSubscribers = (message) => {
        this.subscribersNumbers.forEach(number => {
            this.venomClient.sendText(number, message)
        })
    }

    notifyError = () => {
        this.reportNumbers.forEach(number => {
            this.venomClient.sendText(number, 'Something went wrong!!')
        })
    }
}

module.exports = VenomService