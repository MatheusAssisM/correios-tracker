class MessageService{
    prepareMessage = (lastStatus, order) => {
        const { date, time } = this.prepareDate(lastStatus.dtHrCriado)
        const address = this.prepareAddress(lastStatus.unidade)
        let message = `*Objeto*: ${order.name} - ${order.code}\n*Status*: ${lastStatus.descricao}\n*Local*: ${address}\n*Data*: ${date} as ${time}\n\n`
        return message
    }

    prepareDate = (date) => {
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

    buildMessageString = (messageList) => {
        let lastItem = messageList[messageList.length - 1]
        messageList[messageList.length - 1] = lastItem.substring(0, lastItem.length - 2)
        return messageList.join('')
    }
}

module.exports = MessageService