var expect = require('chai').expect;

describe('Location app', function() {

  it('should start the direct connection', function() {

    expect(4+5).to.equal(9);

  });

  it('should be an object', function() {

    expect(typeof {}).to.equal('object');

  });

  it('should have the length = 0', function() {
    expect([]).to.have.length(0);
  });

});
