const expect = require('expect');
const generateMessages = require('./message').generateMessages;

describe('generateMessages', function() {

    it('test vars', function() {
        var res = generateMessages('juan', 'que pasa');

        expect(res.from).toBe('juan').toBeA('string');
        expect(res.createdAt).toBeA('number');
        expect(res).toInclude({
            from: 'juan',
            text: 'que pasa'
        })
    });
})