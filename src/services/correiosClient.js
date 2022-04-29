const axios = require('axios')

class CorreiosClient {
    URL = 'https://proxyapp.correios.com.br/v1/sro-rastro/'

    async track(code) {
        const response = await axios.get(this.URL + code)
        if (response.status !== 200) {
            throw new Error('Error getting order status')
        }
        return response.data
    }
}

module.exports = CorreiosClient