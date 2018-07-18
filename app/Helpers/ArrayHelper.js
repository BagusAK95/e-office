const ArrayHelper = {
    remove: function(arr, elm) {
        const index = arr.indexOf(elm);
        if (index != -1) {
            arr.splice(index, 1);
            return arr
        } else {
            return arr
        }
    }
}

module.exports = ArrayHelper