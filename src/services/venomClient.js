const venom = require('venom-bot');
const venomConfig = require('../helpers/venomConfig.json');

class VenomClient {
    getClient = () => {
        return venom.create(venomConfig)
    }
}

module.exports = VenomClient