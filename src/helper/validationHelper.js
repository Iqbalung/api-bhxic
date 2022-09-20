
class ValidationHelper {
    async validationMessage (input, Schema) {
        const validation = Schema.validate(input, {abortEarly:false})
        const validationDetail = validation.error?.details ? validation.error?.details : []

        let messageError = {}
        if (validationDetail.length > 0) {
            messageError = {
                status: false,
                message: await this.formatMessage(validationDetail)
            }
        } else {
            messageError = {
                status: true,
                message: "Valid"
            }
        }
    
        return messageError
    }
    
    async formatMessage (messageError) {
        
        let messageArray = []
        messageError.forEach((_value) => {
            let messageData = _value.message.replace(/"/g, '')
            let messages = ""
            if (messageData.indexOf("ref:") !== -1) {
                messages = messageData.replace("ref:", "")
            } else {
                messages = messageData
            }
    
            messageArray.push(messages)
        });
    
        let message = messageArray.join(", ")

        return message
    }   
}

export default ValidationHelper