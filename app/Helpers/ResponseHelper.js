const ResponseHelper = {
    format: function (success, message, data) {
        return {
            success: success, 
            message: message,
            data: data
        }
    }
}

module.exports = ResponseHelper