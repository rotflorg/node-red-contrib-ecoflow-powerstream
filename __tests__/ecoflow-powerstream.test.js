var helper = require('node-red-node-test-helper');
var testNode = require('../dist/ecoflow-powerstream.js');

helper.init(require.resolve('node-red'), {
  functionGlobalContext: { os:require('os') }
});

const TEST_MESSAGES = [
  [10,83,10,40,128,1,220,2,136,1,130,27,152,1,229,3,168,1,211,2,176,1,191,26,192,1,193,15,208,1,153,4,136,2,184,34,168,2,200,5,176,2,145,11,16,53,24,32,32,1,40,1,64,20,72,1,80,40,88,1,128,1,3,136,1,3,202,1,16,72,87,53,49,90,69,72,48,48,48,48,48,48,48,48,48,10,84,10,41,120,226,6,128,1,248,255,255,255,255,255,255,255,255,1,136,1,238,221,34,144,1,176,183,3,192,1,168,62,216,1,168,62,128,2,216,62,232,2,138,11,16,53,24,32,32,1,40,1,64,20,72,4,80,41,88,1,128,1,3,136,1,3,202,1,16,72,87,53,49,90,69,72,48,48,48,48,48,48,48,48,48],
  [10,75,10,32,128,1,215,2,136,1,233,26,168,1,215,2,176,1,239,26,232,1,228,248,255,255,255,255,255,255,255,1,176,2,138,11,16,53,24,32,32,1,40,1,64,20,72,1,80,32,88,1,128,1,3,136,1,3,202,1,16,72,87,53,49,90,69,72,48,48,48,48,48,48,48,48,48,10,63,10,20,120,203,6,136,1,152,223,34,192,1,165,62,128,2,210,62,232,2,129,11,16,53,24,32,32,1,40,1,64,20,72,4,80,20,88,1,128,1,3,136,1,3,202,1,16,72,87,53,49,90,69,72,48,48,48,48,48,48,48,48,48],
];

describe('ecoflow-powerstream Node', function () {

  beforeEach(function (done) {
    helper.startServer(done);
  })
  afterEach(function (done) {
    helper.unload();
    helper.stopServer(done);
  });

  it('should be loaded', function (done) {
    const flow = [{ id: 'n1', type: 'ecoflow-powerstream', name: 'test name' }];
    helper.load(testNode, flow, {}, function () {
      const n1 = helper.getNode('n1');
      expect(n1.name).toEqual('test name');
      done();
    });
  });

  it('should convert binary payload', function (done) {
    const flow = [{ id: 'n1', type: 'ecoflow-powerstream', name: 'test name', wires: [['n2']] }, { id: 'n2', type: 'helper' }];
    helper.load(testNode, flow, function () {
      const n2 = helper.getNode('n2');
      const n1 = helper.getNode('n1');
      const receivedMessages = [];
      n2.on('input', function (msg) {
        const copy = { ...msg };
        delete copy._msgid;
        receivedMessages.push(copy);
      });
      for (const binmsg of TEST_MESSAGES) {
        const buffer = Buffer.from(new Uint8Array(binmsg));
        n1.receive({ payload: buffer });
      }
      setTimeout(function() {
        expect(receivedMessages).toMatchSnapshot();
        done();
      }, 1000);
    });
  });
});
