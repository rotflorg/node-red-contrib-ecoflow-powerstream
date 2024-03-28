var helper = require('node-red-node-test-helper');
var testNode = require('../dist/ecoflow-in.js');

helper.init(require.resolve('node-red'), {
  functionGlobalContext: { os:require('os') }
});


describe('ecoflow-in Node', function () {

  beforeEach(function (done) {
    helper.startServer(done);
  })
  afterEach(function (done) {
    helper.unload();
    helper.stopServer(done);
  });

  it('should be loaded', function (done) {
    const flow = [{ id: 'n1', type: 'ecoflow-in', name: 'test name' }];
    helper.load(testNode, flow, {}, function () {
      const n1 = helper.getNode('n1');
      expect(n1.name).toEqual('test name');
      done();
    });
  });

  it('should convert PowerStream binary payload', function (done) {
    const flow = [{ id: 'n1', type: 'ecoflow-in', name: 'test name', wires: [['n2']] }, { id: 'n2', type: 'helper' }];
    helper.load(testNode, flow, function () {
      const n2 = helper.getNode('n2');
      const n1 = helper.getNode('n1');
      const receivedMessages = [];
      n2.on('input', function(msg) {
        const copy = { ...msg };
        delete copy._msgid;
        receivedMessages.push(copy);
      });
      for (const msg of POWERSTREAM_TEST_MESSAGES) {
        const buffer = Buffer.from(new Uint8Array(msg));
        n1.receive({ payload: buffer });
      }
      setTimeout(function() {
        expect(receivedMessages).toMatchSnapshot();
        done();
      }, 1000);
    });
  });

  it('should convert Delta2Max JSON payload', function (done) {
    const flow = [{ id: 'n1', type: 'ecoflow-in', name: 'test name', devicetype: 'delta2max', wires: [['n2']] }, { id: 'n2', type: 'helper' }];
    helper.load(testNode, flow, function () {
      const n2 = helper.getNode('n2');
      const n1 = helper.getNode('n1');
      const receivedMessages = [];
      n2.on('input', function(msg) {
        const copy = { ...msg };
        delete copy._msgid;
        receivedMessages.push(copy);
      });
      for (const msg of DELTA2MAX_TEST_MESSAGES) {
        n1.receive({ topic: '/app/device/property/R351Z00000000000', payload: msg });
      }
      setTimeout(function() {
        expect(receivedMessages).toMatchSnapshot();
        done();
      }, 1000);
    });
  });

});



const POWERSTREAM_TEST_MESSAGES = [
  [10,83,10,40,128,1,220,2,136,1,130,27,152,1,229,3,168,1,211,2,176,1,191,26,192,1,193,15,208,1,153,4,136,2,184,34,168,2,200,5,176,2,145,11,16,53,24,32,32,1,40,1,64,20,72,1,80,40,88,1,128,1,3,136,1,3,202,1,16,72,87,53,49,90,69,72,48,48,48,48,48,48,48,48,48,10,84,10,41,120,226,6,128,1,248,255,255,255,255,255,255,255,255,1,136,1,238,221,34,144,1,176,183,3,192,1,168,62,216,1,168,62,128,2,216,62,232,2,138,11,16,53,24,32,32,1,40,1,64,20,72,4,80,41,88,1,128,1,3,136,1,3,202,1,16,72,87,53,49,90,69,72,48,48,48,48,48,48,48,48,48],
  [10,75,10,32,128,1,215,2,136,1,233,26,168,1,215,2,176,1,239,26,232,1,228,248,255,255,255,255,255,255,255,1,176,2,138,11,16,53,24,32,32,1,40,1,64,20,72,1,80,32,88,1,128,1,3,136,1,3,202,1,16,72,87,53,49,90,69,72,48,48,48,48,48,48,48,48,48,10,63,10,20,120,203,6,136,1,152,223,34,192,1,165,62,128,2,210,62,232,2,129,11,16,53,24,32,32,1,40,1,64,20,72,4,80,20,88,1,128,1,3,136,1,3,202,1,16,72,87,53,49,90,69,72,48,48,48,48,48,48,48,48,48],
];

const DELTA2MAX_TEST_MESSAGES = [
  {"addr":0,"cmdFunc":0,"cmdId":0,"id":1,"version":"1.0","timestamp":1711646267,"moduleType":"2","params":{
      "bms_kitInfo.watts":[{"appState":1,"curPower":119,"f32Soc":0,"soc":0,"avaFlag":1,"sn":"HW51Z00000000000","detail":1,"type":75,"loadVer":83886338},{"appState":0,"curPower":0,"appVer":0,"f32Soc":0,"soc":0,"avaFlag":0,"sn":"","detail":0,"type":0,"loadVer":0}],
      "bms_kitInfo.version":1,
      "bms_kitInfo.kitNum":2,}},
  {"addr":0,"cmdFunc":0,"cmdId":0,"id":2,"version":"1.0","timestamp":1711646267,"moduleType":"2","params":{
      "bms_bmsStatus.designCap":40000,
      "bms_bmsStatus.temp":27,
      "bms_bmsStatus.minCellVol":3256,
      "bms_bmsStatus.cycles":6,
      "bms_bmsStatus.f32ShowSoc":21.9,
      "bms_bmsStatus.outputWatts":0,
      "bms_bmsStatus.maxCellVol":3262,
      "bms_bmsStatus.type":1,
      "bms_bmsStatus.maxCellTemp":27,
      "bms_bmsStatus.cellId":2,
      "bms_bmsStatus.minMosTemp":25,
      "bms_bmsStatus.vol":52271,
      "bms_bmsStatus.actSoc":23,
      "bms_bmsStatus.maxVolDiff":6,
      "bms_bmsStatus.bqSysStatReg":0,
      "bms_bmsStatus.fullCap":39280,
      "bms_bmsStatus.balanceState":0,
      "bms_bmsStatus.openBmsIdx":5,
      "bms_bmsStatus.sysState":2,
      "bms_bmsStatus.num":0,
      "bms_bmsStatus.soc":22,
      "bms_bmsStatus.errCode":0,
      "bms_bmsStatus.inputWatts":0,
      "bms_bmsStatus.cycSoh":99,
      "bms_bmsStatus.tagChgAmp":40000,
      "bms_bmsStatus.bmsHeartVer":259,
      "bms_bmsStatus.productType":81,
      "bms_bmsStatus.maxMosTemp":30,
      "bms_bmsStatus.minCellTemp":26,
      "bms_bmsStatus.chgState":1,
      "bms_bmsStatus.diffSoc":1,
      "bms_bmsStatus.targetSoc":21.8,
      "bms_bmsStatus.soh":100,
      "bms_bmsStatus.productDetail":2,
      "bms_bmsStatus.remainCap":8967,
      "bms_bmsStatus.remainTime":0,
      "bms_bmsStatus.allErrCode":0,
      "bms_bmsStatus.caleSoh":0,
      "bms_bmsStatus.amp":-12,
      "bms_bmsStatus.bmsFault":0,
      "bms_bmsStatus.dsgCap":4294967295,
      "bms_bmsStatus.allBmsFault":0,
      "bms_bmsStatus.realSoh":0,
      "bms_bmsStatus.chgCap":4294967295}},
  {"addr":0,"cmdFunc":0,"cmdId":0,"id":3,"version":"1.0","timestamp":1711646267,"moduleType":"4","params":{
      "bms_slave_bmsSlaveStatus_2.f32ShowSoc":22.9,
      "bms_slave_bmsSlaveStatus_2.errCode":0,
      "bms_slave_bmsSlaveStatus_2.outputWatts":24,
      "bms_slave_bmsSlaveStatus_2.remainCap":9002,
      "bms_slave_bmsSlaveStatus_2.designCap":40000,
      "bms_slave_bmsSlaveStatus_2.type":1,
      "bms_slave_bmsSlaveStatus_2.cellId":2,
      "bms_slave_bmsSlaveStatus_2.bqSysStatReg":0,
      "bms_slave_bmsSlaveStatus_2.minCellVol":3254,
      "bms_slave_bmsSlaveStatus_2.balanceState":0,
      "bms_slave_bmsSlaveStatus_2.minCellTemp":23,
      "bms_slave_bmsSlaveStatus_2.minMosTemp":24,
      "bms_slave_bmsSlaveStatus_2.bmsFault":0,
      "bms_slave_bmsSlaveStatus_2.inputWatts":0,
      "bms_slave_bmsSlaveStatus_2.cycles":0,
      "bms_slave_bmsSlaveStatus_2.ecloudOcv":0,
      "bms_slave_bmsSlaveStatus_2.maxCellTemp":24,
      "bms_slave_bmsSlaveStatus_2.amp":-471,
      "bms_slave_bmsSlaveStatus_2.openBmsIdx":5,
      "bms_slave_bmsSlaveStatus_2.tagChgAmp":40000,
      "bms_slave_bmsSlaveStatus_2.bmsHeartVer":0,
      "bms_slave_bmsSlaveStatus_2.num":2,
      "bms_slave_bmsSlaveStatus_2.maxVolDiff":3,
      "bms_slave_bmsSlaveStatus_2.maxMosTemp":25,
      "bms_slave_bmsSlaveStatus_2.mosState":3,
      "bms_slave_bmsSlaveStatus_2.soc":23,
      "bms_slave_bmsSlaveStatus_2.soh":100,
      "bms_slave_bmsSlaveStatus_2.remainTime":1149,
      "bms_slave_bmsSlaveStatus_2.temp":23,
      "bms_slave_bmsSlaveStatus_2.maxCellVol":3257,
      "bms_slave_bmsSlaveStatus_2.vol":51919,
      "bms_slave_bmsSlaveStatus_2.fullCap":39280}},
  {"addr":0,"cmdFunc":0,"cmdId":0,"id":4,"version":"1.0","timestamp":1711646267,"moduleType":"4","params":{
      "bms_slave_bmsSlaveStatus_2.f32ShowSoc":22.9,
      "bms_slave_bmsSlaveStatus_2.cellVol":[],
      "bms_slave_bmsSlaveStatus_2.cellTemp":[],
      "bms_slave_bmsSlaveStatus_2.vol":51918}},
  {"addr":0,"cmdFunc":0,"cmdId":0,"id":5,"version":"1.0","timestamp":1711646267,"moduleType":"1","params":{
      "pd.typec1Temp":25,
      "pd.wattsInSum":103,
      "pd.model":4,
      "pd.bpPowerSoc":22,
      "pd.wifiAutoRcvy":0,
      "pd.beepMode":0,
      "pd.remainTime":1200,
      "pd.typec2Watts":0,
      "pd.pv1ChargeWatts":79,
      "pd.hysteresisAdd":5,
      "pd.chgSunPower":0,
      "pd.carTemp":46,
      "pd.XT150Watts1":119,
      "pd.XT150Watts2":-24,
      "pd.pvChargePrioSet":0,
      "pd.usb1Watts":0,
      "pd.dsgPowerAC":1256,
      "pd.qcUsb2Watts":0,
      "pd.wireWatts":0,
      "pd.chgPowerAC":1270,
      "pd.lcdOffSec":30,
      "pd.watchIsConfig":1,
      "pd.typec2Temp":25,
      "pd.carUsedTime":2822,
      "pd.invInWatts":0,
      "pd.typec1Watts":0,
      "pd.chgDsgState":1,
      "pd.pv2ChargeType":0,
      "pd.otherKitState":0,
      "pd.soc":22,
      "pd.qcUsb1Watts":0,
      "pd.reserved":[0,0],
      "pd.acAutoPause":0,
      "pd.chgPowerDC":4599,
      "pd.dsgPowerDC":70,
      "pd.standbyMin":0,
      "pd.typecUsedTime":56,
      "pd.brightLevel":100,
      "pd.usbqcUsedTime":58,
      "pd.acAutoOnCfg":0,
      "pd.dcOutState":0,
      "pd.bmsKitState":[67,65],
      "pd.newAcAutoOnCfg":0,
      "pd.minAcSoc":20,
      "pd.wattsOutSum":117,
      "pd.usbUsedTime":51,
      "pd.mpptUsedTime":0,
      "pd.relaySwitchCnt":1,
      "pd.wifiRssi":0,
      "pd.pv1ChargeType":2,
      "pd.errCode":0,
      "pd.pv2ChargeWatts":0,
      "pd.carWatts":0,
      "pd.usb2Watts":0,
      "pd.invOutWatts":0,
      "pd.carState":0,
      "pd.invUsedTime":6610}},
  {"addr":0,"cmdFunc":0,"cmdId":0,"id":6,"version":"1.0","timestamp":1711646267,"moduleType":"5","params":{
      "mppt.carOutVol":0,
      "mppt.carState":0,
      "mppt.faultCode":0,
      "mppt.dc24vState":0,
      "mppt.pv2ChgType":0,
      "mppt.pv2InWatts":0,
      "mppt.carTemp":45,
      "mppt.outWatts":69,
      "mppt.x60ChgType":0,
      "mppt.carOutAmp":30,
      "mppt.pv2ChgPauseFlag":0,
      "mppt.outAmp":1346,
      "mppt.chgPauseFlag":0,
      "mppt.dcdc12vWatts":0,
      "mppt.pv2InVol":49,
      "mppt.inWatts":79,
      "mppt.dcdc12vVol":0,
      "mppt.inAmp":2101,
      "mppt.pv2ChgState":0,
      "mppt.inVol":37847,
      "mppt.carOutWatts":0,
      "mppt.mpptTemp":57,
      "mppt.outVol":51605,
      "mppt.chgType":2,
      "mppt.pv2InAmp":0,
      "mppt.dcdc12vAmp":0,
      "mppt.pv2Xt60ChgType":0,
      "mppt.pv2MpptTemp":56,
      "mppt.cfgChgType":0,
      "mppt.pv2DcChgCurrent":8000,
      "mppt.pv2CfgChgType":0,
      "mppt.dc24vTemp":42,
      "mppt.carStandbyMin":60,
      "mppt.dcChgCurrent":8000,
      "mppt.chgState":1}},
  {"addr":0,"cmdFunc":0,"cmdId":0,"id":7,"version":"1.0","timestamp":1711646271,"moduleType":"3","params":{
      "inv.standbyMin":30,
      "inv.dcInVol":0,
      "inv.cfgAcWorkMode":0,
      "inv.SlowChgWatts":400,
      "inv.dcInAmp":0,
      "inv.prBalanceMode":0,
      "inv.cfgAcOutFreq":1,
      "inv.outputWatts":0,
      "inv.errCode":0,
      "inv.dcInTemp":32,
      "inv.invOutFreq":0,
      "inv.chargerType":0,
      "inv.acInAmp":0,
      "inv.fanState":0,
      "inv.acChgRatedPower":2400,
      "inv.cfgAcXboost":0,
      "inv.cfgAcEnabled":0,
      "inv.outTemp":32,
      "inv.invType":8,
      "inv.cfgAcOutVol":230000,
      "inv.acDipSwitch":1,
      "inv.acInVol":0,
      "inv.invOutVol":0,
      "inv.FastChgWatts":2400,
      "inv.inputWatts":0,
      "inv.acPassbyAutoEn":0,
      "inv.chgPauseFlag":0,
      "inv.acInFreq":0,
      "inv.dischargeType":0,
      "inv.invOutAmp":0}},
  {"addr":0,"cmdFunc":0,"cmdId":0,"id":8,"version":"1.0","timestamp":1711646267,"moduleType":"2","params":{
      "bms_emsStatus.maxChargeSoc":92,
      "bms_emsStatus.emsVer":259,
      "bms_emsStatus.openUpsFlag":1,
      "bms_emsStatus.minDsgSoc":15,
      "bms_emsStatus.minOpenOilEb":0,
      "bms_emsStatus.sysChgDsgState":0,
      "bms_emsStatus.maxAvailNum":2,
      "bms_emsStatus.emsIsNormalFlag":1,
      "bms_emsStatus.maxCloseOilEb":100,
      "bms_emsStatus.dsgCmd":1,
      "bms_emsStatus.dsgDisCond":0,
      "bms_emsStatus.chgVol":54263,
      "bms_emsStatus.chgRemainTime":5999,
      "bms_emsStatus.f32LcdShowSoc":22.4,
      "bms_emsStatus.paraVolMax":52953,
      "bms_emsStatus.chgLinePlug":36,
      "bms_emsStatus.lcdShowSoc":22,
      "bms_emsStatus.bmsModel":4,
      "bms_emsStatus.chgDisCond":0,
      "bms_emsStatus.chgAmp":60000,
      "bms_emsStatus.chgState":1,
      "bms_emsStatus.openBmsIdx":5,
      "bms_emsStatus.paraVolMin":50953,
      "bms_emsStatus.chgCmd":1,
      "bms_emsStatus.bmsWarState":0,
      "bms_emsStatus.dsgRemainTime":1200,
      "bms_emsStatus.fanLevel":0}},
];
