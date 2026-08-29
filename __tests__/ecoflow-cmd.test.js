var helper = require('node-red-node-test-helper');
var testNode = require('../dist/ecoflow-cmd.js');

helper.init(require.resolve('node-red'), {
  functionGlobalContext: { os:require('os') }
});


describe('ecoflow-cmd Node', function () {
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
    const flow = [{ id: 'n1', type: 'ecoflow-cmd', name: 'test name' }];
    helper.load(testNode, flow, {}, function () {
      const n1 = helper.getNode('n1');
      expect(n1.name).toEqual('test name');
      done();
    });
  });

  it('should convert PowerStream getLatestQuotas payload', function (done) {
    const flow = [{ id: 'n1', type: 'ecoflow-cmd', name: 'test name', userid: 'abc', devicetype: 'powerstream', wires: [['n2']] }, { id: 'n2', type: 'helper' }];
    helper.load(testNode, flow, function () {
      const n2 = helper.getNode('n2');
      const n1 = helper.getNode('n1');
      const receivedMessages = [];
      n2.on('input', function(msg) {
        const copy = { ...msg };
        delete copy._msgid;
        receivedMessages.push(copy);
      });
      n1.receive({ payload: { command: 'getLatestQuotas', value: 1, deviceSn: 'HW51ZEH000000000' } });
      setTimeout(function() {
        expect(receivedMessages).toMatchSnapshot();
        done();
      }, 1000);
    });
  });

  it('should convert PowerStream setAcWatts payload', function (done) {
    const flow = [{ id: 'n1', type: 'ecoflow-cmd', name: 'test name', userid: 'abc', devicetype: 'powerstream', wires: [['n2']] }, { id: 'n2', type: 'helper' }];
    helper.load(testNode, flow, function () {
      const n2 = helper.getNode('n2');
      const n1 = helper.getNode('n1');
      const receivedMessages = [];
      n2.on('input', function(msg) {
        const copy = { ...msg };
        delete copy._msgid;
        receivedMessages.push(copy);
      });
      n1.receive({ payload: { command: 'setAcWatts', value: 100, deviceSn: 'HW51ZEH000000000' } });
      setTimeout(function() {
        expect(receivedMessages).toMatchSnapshot();
        done();
      }, 1000);
    });
  });

  it('should convert STREAM Series setBackupReserve payload', function (done) {
    const flow = [{ id: 'n1', type: 'ecoflow-cmd', name: 'test name', userid: 'abc', devicetype: 'streams', wires: [['n2']] }, { id: 'n2', type: 'helper' }];
    helper.load(testNode, flow, function () {
      const n2 = helper.getNode('n2');
      const n1 = helper.getNode('n1');
      const receivedMessages = [];
      n2.on('input', function(msg) {
        const copy = { ...msg };
        delete copy._msgid;
        receivedMessages.push(copy);
      });
      n1.receive({ payload: { command: 'setBackupReserve', value: 50, deviceSn: 'HW51ZEH000000000' } });
      setTimeout(function() {
        expect(receivedMessages).toMatchSnapshot();
        done();
      }, 1000);
    });
  });

  it('should convert STREAM Series encodeStreamSeriesSetChargingRange payload', function (done) {
    const flow = [{ id: 'n1', type: 'ecoflow-cmd', name: 'test name', userid: 'abc', devicetype: 'streams', wires: [['n2']] }, { id: 'n2', type: 'helper' }];
    helper.load(testNode, flow, function () {
      const n2 = helper.getNode('n2');
      const n1 = helper.getNode('n1');
      const receivedMessages = [];
      n2.on('input', function(msg) {
        const copy = { ...msg };
        delete copy._msgid;
        receivedMessages.push(copy);
      });
      n1.receive({ payload: { command: 'setChargingRange', min: 20, max: 80, deviceSn: 'HW51ZEH000000000' } });
      setTimeout(function() {
        expect(receivedMessages).toMatchSnapshot();
        done();
      }, 1000);
    });
  });

  it('should convert STREAM Series encodeStreamSeriesSetResidentLoad payload', function (done) {
    const flow = [{ id: 'n1', type: 'ecoflow-cmd', name: 'test name', userid: 'abc', devicetype: 'streams', wires: [['n2']] }, { id: 'n2', type: 'helper' }];
    helper.load(testNode, flow, function () {
      const n2 = helper.getNode('n2');
      const n1 = helper.getNode('n1');
      const receivedMessages = [];
      n2.on('input', function(msg) {
        const copy = { ...msg };
        delete copy._msgid;
        receivedMessages.push(copy);
      });
      n1.receive({ payload: { command: 'setResidentLoad', value: 100, deviceSn: 'HW51ZEH000000000' } });
      setTimeout(function() {
        expect(receivedMessages).toMatchSnapshot();
        done();
      }, 1000);
    });
  });

});
