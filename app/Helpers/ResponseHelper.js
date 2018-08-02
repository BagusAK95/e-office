const ResponseHelper = {
    format: function (success, message, data) {
        let strMessage = message
        if (message) {
            if (message.sqlMessage) {
                strMessage = message.sqlMessage
            } else if (message.message) {
                strMessage = message.message            
            }
        }

        return {
            success: success, 
            message: strMessage,
            data: data
        }
    }
}

module.exports = ResponseHelper