var helper = require('node-red-node-test-helper');
var testNode = require('../dist/ecoflow-out.js');

helper.init(require.resolve('node-red'), {
  functionGlobalContext: { os:require('os') }
});


describe('ecoflow-out Node', function () {
  let dateNowSpy;
  beforeEach(function (done) {
    helper.startServer(done);
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1704063600000);
  })
  afterEach(function (done) {
    dateNowSpy.mockRestore();
    helper.unload();
    helper.stopServer(done);
  });

  it('should be loaded', function (done) {
    const flow = [{ id: 'n1', type: 'ecoflow-out', name: 'test name' }];
    helper.load(testNode, flow, {}, function () {
      const n1 = helper.getNode('n1');
      expect(n1.name).toEqual('test name');
      done();
    });
  });

  it('should convert PowerStream getLatestQuotas payload', function (done) {
    const flow = [{ id: 'n1', type: 'ecoflow-out', name: 'test name', devicetype: 'powerstream', devicesn: 'HW51ZEH000000000', wires: [['n2']] }, { id: 'n2', type: 'helper' }];
    helper.load(testNode, flow, function () {
      const n2 = helper.getNode('n2');
      const n1 = helper.getNode('n1');
      const receivedMessages = [];
      n2.on('input', function(msg) {
        const copy = { ...msg };
        delete copy._msgid;
        receivedMessages.push(copy);
      });
      n1.receive({ payload: { getLatestQuotas: 1 } });
      setTimeout(function() {
        expect(receivedMessages).toMatchSnapshot();
        done();
      }, 1000);
    });
  });

  it('should convert PowerStream setAcWatts payload', function (done) {
    const flow = [{ id: 'n1', type: 'ecoflow-out', name: 'test name', devicetype: 'powerstream', devicesn: 'HW51ZEH000000000', wires: [['n2']] }, { id: 'n2', type: 'helper' }];
    helper.load(testNode, flow, function () {
      const n2 = helper.getNode('n2');
      const n1 = helper.getNode('n1');
      const receivedMessages = [];
      n2.on('input', function(msg) {
        const copy = { ...msg };
        delete copy._msgid;
        receivedMessages.push(copy);
      });
      n1.receive({ payload: { setAcWatts: 100 } });
      setTimeout(function() {
        expect(receivedMessages).toMatchSnapshot();
        done();
      }, 1000);
    });
  });

});
