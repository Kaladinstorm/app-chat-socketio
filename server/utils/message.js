const moment = require('moment');

var generateMessages = function(from, text) {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    }
};

module.exports = { generateMessages };