// Protocol definition taken from:
// https://forum.iobroker.net/assets/uploads/files/1704442310021-ecoflow-connector_v121.txt

import { IParserResult, parse } from 'protobufjs';


export const PROTOCOL_SOURCE = `
syntax = "proto3";
message Message {
  repeated Header header = 1 ;
  optional bytes payload = 2;
}
message Header {
  optional bytes pdata = 1;
  optional int32 src = 2;
  optional int32 dest = 3;
  optional int32 d_src= 4;
  optional int32 d_dest = 5;
  optional int32 enc_type = 6;
  optional int32 check_type = 7;
  optional int32 cmd_func = 8;
  optional int32 cmd_id = 9;
  optional int32 data_len = 10;
  optional int32 need_ack = 11;
  optional int32 is_ack = 12;
  optional int32 seq = 14;
  optional int32 product_id = 15;
  optional int32 version = 16;
  optional int32 payload_ver = 17;
  optional int32 time_snap = 18;
  optional int32 is_rw_cmd = 19;
  optional int32 is_queue = 20;
  optional int32 ack_type= 21;
  optional string code = 22;
  optional string from = 23;
  optional string module_sn = 24;
  optional string device_sn = 25;
}
message InverterHeartbeat {
  optional uint32 invErrCode = 1;
  optional uint32 invWarnCode = 3;
  optional uint32 pv1ErrCode = 2;
  optional uint32 pv1WarnCode = 4;
  optional uint32 pv2ErrCode = 5;
  optional uint32 pv2WarningCode = 6;
  optional uint32 batErrCode = 7;
  optional uint32 batWarningCode = 8;
  optional uint32 llcErrCode = 9;
  optional uint32 llcWarningCode = 10;
  optional uint32 pv1Status = 11;
  optional uint32 pv2Status = 12;
  optional uint32 batStatus = 13;
  optional uint32 llcStatus = 14;
  optional uint32 invStatus = 15;
  optional int32 pv1InputVolt = 16;
  optional int32 pv1OpVolt = 17;
  optional int32 pv1InputCur = 18;
  optional int32 pv1InputWatts = 19;
  optional int32 pv1Temp = 20;
  optional int32 pv2InputVolt = 21;
  optional int32 pv2OpVolt = 22;
  optional int32 pv2InputCur = 23;
  optional int32 pv2InputWatts = 24;
  optional int32 pv2Temp = 25;
  optional int32 batInputVolt = 26;
  optional int32 batOpVolt = 27;
  optional int32 batInputCur = 28;
  optional int32 batInputWatts = 29;
  optional int32 batTemp = 30;
  optional uint32 batSoc = 31;
  optional int32 llcInputVolt = 32;
  optional int32 llcOpVolt = 33;
  optional int32 llcTemp = 34;
  optional int32 invInputVolt = 35;
  optional int32 invOpVolt = 36;
  optional int32 invOutputCur = 37;
  optional int32 invOutputWatts = 38;
  optional int32 invTemp = 39;
  optional int32 invFreq = 40;
  optional int32 invDcCur = 41;
  optional int32 bpType = 42;
  optional int32 invRelayStatus = 43;
  optional int32 pv1RelayStatus = 44;
  optional int32 pv2RelayStatus = 45;
  optional uint32 installCountry = 46;
  optional uint32 installTown = 47;
  optional uint32 permanentWatts = 48;
  optional uint32 dynamicWatts = 49;
  optional uint32 supplyPriority = 50;
  optional uint32 lowerLimit = 51;
  optional uint32 upperLimit = 52;
  optional uint32 invOnOff = 53;
  optional uint32 wirelessErrCode = 54;
  optional uint32 wirelessWarnCode = 55;
  optional uint32 invBrightness = 56;
  optional uint32 heartbeatFrequency = 57;
  optional uint32 ratedPower = 58;
  optional int32 batChargingTime = 59;
  optional int32 batDischargingTime = 60;
  optional int32 feedPriority = 61;
}
message InverterHeartbeat2 {
  optional int32 pv1_active_1 = 1; //pv1 off/on?
  optional int32 pv1_status_2 = 2; //status pv1
  optional int32 pv2_active_3 = 3; //pv2 off/on?
  optional int32 pv2_status_4 = 4; //status pv2
  optional int32 X_Unknown_5 = 5;
  optional int32 status_6 = 6; //status
  optional int32 upperLimit = 7;
  optional int32 lowerLimit = 8;
  optional int32 status_9 = 9; //status 48->4096
  optional int32 status_10 = 10; //status
  optional int32 X_Unknown_11 = 11;
  optional int32 baseLoad = 12;
  optional int32 powerPlugsPos = 13; //stream power to plugs positive
  optional int32 X_Unknown_14 = 14;
  optional int32 X_Unknown_15 = 15; //power?
  optional int32 X_Unknown_16 = 16;
  optional int32 X_Unknown_17 = 17;
  optional int32 X_Unknown_18 = 18;
  optional int32 X_Unknown_19 = 19;
  optional int32 X_Unknown_20 = 20;
  optional int32 X_Unknown_21 = 21;
  optional int32 X_Unknown_22 = 22;
  optional int32 X_Unknown_23 = 23;
  optional int32 X_Unknown_24 = 24; //disch/chargeTime
  optional int32 X_Unknown_25 = 25;
  optional int32 X_Unknown_26 = 26;
  optional int32 X_Unknown_27 = 27; //disch/chargeTime
  optional int32 X_Unknown_28 = 28;
  optional int32 X_Unknown_29 = 29;
  optional int32 X_Unknown_30 = 30;
  optional int32 X_Unknown_31 = 31;
  optional int32 uptime = 32;
  optional int32 X_Unknown_33 = 33;
  optional int32 X_Unknown_34 = 34;
  optional int32 X_Unknown_35 = 35;
  optional int32 X_Unknown_36 = 36;
  optional int32 X_Unknown_37 = 37;
  optional int32 X_Unknown_38 = 38;
  optional int32 X_Unknown_39 = 39;
  optional int32 X_Unknown_40 = 40;
  optional int32 X_Unknown_41 = 41;
  optional int32 X_Unknown_42 = 42;
  optional int32 X_Unknown_43 = 43;
  optional int32 plugsConn_44 = 44; // plugs connected for dynamic watt
  optional int32 gridWatt_45 = 45;
  optional int32 powerPlugsNeg = 46; // stream power to plugs negative
  optional int32 X_Unknown_47 = 47;
  optional int32 unixtime_48 = 48; // Anfangszeit history werte?
  optional int32 X_Unknown_49 = 49;
  optional int32 unixtime_50 = 50;
  optional int32 X_Unknown_51 = 51; //letzte Zeit history?
  optional int32 wifiRssi = 52; //wifiRssi
}

message SetMessage {
  SetHeader header = 1;
}
message SetHeader {
  SetValue pdata = 1 [proto3_optional = true];
  int32 src = 2 [proto3_optional = true];
  int32 dest = 3 [proto3_optional = true];
  int32 dSrc = 4 [proto3_optional = true];
  int32 dDest = 5 [proto3_optional = true];
  int32 encType = 6 [proto3_optional = true];
  int32 checkType = 7 [proto3_optional = true];
  int32 cmdFunc = 8 [proto3_optional = true];
  int32 cmdId = 9 [proto3_optional = true];
  int32 dataLen = 10 [proto3_optional = true];
  int32 needAck = 11 [proto3_optional = true];
  int32 isAck = 12 [proto3_optional = true];
  int32 seq = 14 [proto3_optional = true];
  int32 productId = 15 [proto3_optional = true];
  int32 version = 16 [proto3_optional = true];
  int32 payloadVer = 17 [proto3_optional = true];
  int32 timeSnap = 18 [proto3_optional = true];
  int32 isRwCmd = 19 [proto3_optional = true];
  int32 isQueue = 20 [proto3_optional = true];
  int32 ackType = 21 [proto3_optional = true];
  string code = 22 [proto3_optional = true];
  string from = 23 [proto3_optional = true];
  string moduleSn = 24 [proto3_optional = true];
  string deviceSn = 25 [proto3_optional = true];
}
message SetValue {
  optional int32 value = 1;
  optional int32 value2 = 2;
  optional uint32 cfgUtcTime = 6;
  optional uint32 cmsMaxChgSoc = 33;
  optional uint32 cmsMinDsgSoc = 34;
  optional uint32 backupReserveSoc = 102;
  optional uint32 feedGridModePowLimit = 169;
  optional DayResidentLoadList dayResidentLoadList = 379;
}


message permanent_watts_pack {
  optional uint32 permanent_watts = 1;
}
message supply_priority_pack {
  optional uint32 supply_priority = 1;
}
message feed_priority_pack {
  optional uint32 supply_priority = 1;
}
message bat_lower_pack {
  optional int32 lower_limit = 1;
}

message bat_upper_pack {
  optional int32 upper_limit = 1;
}


message PowerItem {
  optional uint32 timestamp = 1;
  optional sint32 timezone = 2;
  optional uint32 inv_to_grid_power = 3;
  optional uint32 inv_to_plug_power = 4;
  optional int32 battery_power = 5;
  optional uint32 pv1_output_power = 6;
  optional uint32 pv2_output_power = 7;
}

message PowerPack {
  optional uint32 sys_seq = 1;
  repeated PowerItem sys_power_stream = 2;
}

message EnergyItem {
  optional uint32 timestamp = 1;
  optional uint32 watth_type = 2;
  repeated uint32 watth = 3;
}

message EnergyPack {
  optional uint32 sys_seq = 1;
  repeated EnergyItem sys_energy_stream = 2;
}


message EnergyTotalReport {
  optional uint32 watth_seq = 1;
  optional EnergyItem watth_item = 2;
}

message BatchEnergyTotalReport {
  optional uint32 watth_seq = 1;
  repeated EnergyItem watth_item = 2;
}

message EnergyTotalReportAck {
  optional uint32 result = 1;
  optional uint32 watth_seq = 2;
  optional uint32 watth_type = 3;
}

message PowerAckPack {
  optional uint32 sys_seq = 1;
}

message node_massage {
  optional string sn = 1;
  optional bytes mac = 2;
}

message mesh_child_node_info {
  optional uint32 topology_type = 1;
  optional uint32 mesh_protocol = 2;
  optional uint32 max_sub_device_num = 3;
  optional bytes parent_mac_id = 4;
  optional bytes mesh_id = 5;
  repeated node_massage sub_device_list = 6;
}



message EventRecordItem {
  optional uint32 timestamp = 1;
  optional uint32 sys_ms = 2;
  optional uint32 event_no = 3;
  repeated float event_detail = 4;
}
message EventRecordReport {
  optional uint32 event_ver = 1;
  optional uint32 event_seq = 2;
  repeated EventRecordItem event_item = 3;
}
message EventInfoReportAck {
  optional uint32 result = 1;
  optional uint32 event_seq = 2;
  optional uint32 event_item_num = 3;
}
message ProductNameSet {
  optional string name = 1;
}
message ProductNameSetAck {
  optional uint32 result = 1;
}
message ProductNameGet {
}
message ProductNameGetAck {
  optional string name = 3;
}
message RTCTimeGet {
}

message RTCTimeGetAck {
  optional uint32 timestamp = 1;
  optional int32 timezone = 2;
}
message RTCTimeSet {
  optional uint32 timestamp = 1;
  optional int32 timezone = 2 [(nanopb).default = 0];
}
message RTCTimeSetAck {
  optional uint32 result = 1;
}
message country_town_message {
  optional uint32 country = 1;
  optional uint32 town = 2;
}
message time_task_config {
  optional uint32 task_index = 1;
  optional time_range_strategy time_range = 2;
  optional uint32 type = 3; // Task type: 1: prioritize power supply; 2: prioritize power storage
}
message time_task_delet {
  optional uint32 task_index = 1;
}
message TimeTaskConfig {
  optional time_task_config task1 = 1;
  optional time_task_config task2 = 2;
  optional time_task_config task3 = 3;
  optional time_task_config task4 = 4;
  optional time_task_config task5 = 5;
  optional time_task_config task6 = 6;
  optional time_task_config task7 = 7;
  optional time_task_config task8 = 8;
  optional time_task_config task9 = 9;
  optional time_task_config task10 = 10;
  optional time_task_config task11 = 11;
}
message time_task_config_ack {
  optional uint32 task_info = 1;
}
message rtc_data {
  optional int32 week = 1 [(nanopb).default = 0];
  optional int32 sec = 2 [(nanopb).default = 0];
  optional int32 min = 3 [(nanopb).default = 0];
  optional int32 hour = 4 [(nanopb).default = 0];
  optional int32 day = 5 [(nanopb).default = 0];
  optional int32 month = 6 [(nanopb).default = 0];
  optional int32 year = 7 [(nanopb).default = 0];
}
message time_range_strategy {
  optional bool is_config = 1; // Whether to enable: 0: no; 1: yes
  optional bool is_enable = 2; // Whether to configure: 0: no; 1: yes
  optional int32 time_mode = 3; // Scheduled mode: 0: daily; 1: weekly; 2: monthly; 3: do not repeat
  optional int32 time_data = 4; // mode == 1, bit0-bit6 represents Monday to Saturday respectively; mode == 2, bit0-bit30 represents the 1st to the 31st
  optional rtc_data start_time = 5;
  optional rtc_data stop_time = 6;
}
message plug_ack_message {
  optional uint32 ack = 1;
}

message plug_heartbeat {
  optional uint32 err_code = 1;
  optional uint32 warn_code = 2;
  optional uint32 country = 3;
  optional uint32 town = 4;
  optional int32 max_cur = 5;
  optional int32 temp = 6;
  optional int32 freq = 7;
  optional int32 current = 8;
  optional int32 volt = 9;
  optional int32 watts = 10;
  optional bool switch = 11; //switchSta
  optional int32 brightness = 12;
  optional int32 max_watts = 13;
  optional int32 heartbeat_frequency = 14;
  optional int32 mesh_enable = 15;
  optional int32 unknown16 = 16;
  optional int32 unknown17 = 17;
  optional int32 unknown18 = 18;
  optional int32 uptime = 19;
  optional int32 unknown20 = 20;
  optional int32 unknown21 = 21;
  optional int32 unknown22 = 22;
  optional int32 unknown23 = 23;
  optional int32 unknown24 = 24;
  optional int32 unknown25 = 25;
  optional int32 unknown26 = 26;
  optional int32 unknown27 = 27;
  optional int32 unknown28 = 28;
  optional int32 unknown29 = 29;
  optional int32 unknown30 = 30;
  optional int32 streamConn_31 = 31;//stream connected
  optional int32 cntDevices = 32; //count of devices
  optional int32 streamOutputPower = 33; //total streamoutputpower
  optional int32 powerPlugs = 34; // power to plugs
  optional int32 unknown35 = 35;
  optional int32 unknown36 = 36;
  optional int32 unknown37 = 37;
  optional int32 unixtime_38 = 38; //unixtime, ggf. last connection, when connected to mqtt server
  optional int32 dynWattEnable = 39; //plug included for dynamic watts
  optional int32 wifiRssi = 40; //wifiRssi
}
message plug_switch_message {
  optional uint32 plug_switch = 1;
}
message brightness_pack {
  optional int32 brightness = 1 [(nanopb).default = 0];
}
message max_cur_pack {
  optional int32 max_cur = 1 [(nanopb).default = 0];
}
message max_watts_pack {
  optional int32 max_watts = 1 [(nanopb).default = 0];
}
message mesh_ctrl_pack {
  optional uint32 mesh_enable = 1 [(nanopb).default = 0];
}
message ret_pack {
  optional bool ret_sta = 1 [(nanopb).default = false];
}

message include_plug {
  optional bool include_plug = 1 [(nanopb).default = false];
}

message ScheduleOutput {
  string sn_suffix = 1;
  uint32 workmode = 2;
  uint32 pwr = 3;
}

message LanSysScheduleOutput {
  repeated ScheduleOutput output = 1;
}

message RuntimePropertyUpload {
  optional int32 display_property_full_upload_period = 293;
  optional int32 display_property_incremental_upload_period = 294;
  optional int32 runtime_property_full_upload_period = 295;
  optional int32 runtime_property_incremental_upload_period = 296;
  optional int32 lan_sys_meter_value = 1067;
  optional int32 lan_sys_home_need_pwr = 1066;
  optional uint32 ai_tou_valid = 1068;
  optional uint32 ai_tou_target_soc = 1069;
  optional uint32 lan_sys_device_cnt = 1297;
  optional uint32 lan_sys_work_mode = 1298;
  optional int32 lan_sys_target_pwr = 1299;
  optional LanSysScheduleOutput lan_sys_schedule_output = 1300;
  optional uint32 cascade_sys_work_mode = 1301;
  optional int32 cascade_sys_target_pwr = 1302;
  optional uint32 cascade_sys_soc = 1303;
  optional uint32 cascade_sys_device_cnt = 1304;
  optional uint32 cascade_sys_can_id = 1305;
  optional int32 cascade_sys_distributed_pwr_sum = 1306;
  optional int32 cascade_sys_output_pwr_diff = 1307;
  optional int32 dev1_distribute_target = 1308;
  optional int32 dev2_distribute_target = 1309;
  optional int32 dev3_distribute_target = 1310;
  optional int32 dev4_distribute_target = 1311;
  optional int32 dev5_distribute_target = 1312;
  optional int32 dev6_distribute_target = 1313;
  optional uint32 dev1_to_pcs_work_mode = 1314;
  optional uint32 dev2_to_pcs_work_mode = 1315;
  optional uint32 dev3_to_pcs_work_mode = 1316;
  optional uint32 dev4_to_pcs_work_mode = 1317;
  optional uint32 dev5_to_pcs_work_mode = 1318;
  optional uint32 dev6_to_pcs_work_mode = 1319;
  optional int32 dev1_to_pcs_pwr = 1320;
  optional int32 dev2_to_pcs_pwr = 1321;
  optional int32 dev3_to_pcs_pwr = 1322;
  optional int32 dev4_to_pcs_pwr = 1323;
  optional int32 dev5_to_pcs_pwr = 1324;
  optional int32 dev6_to_pcs_pwr = 1325;
  optional int32 dev1_pv_remain = 1326;
  optional int32 dev2_pv_remain = 1327;
  optional int32 dev3_pv_remain = 1328;
  optional int32 dev4_pv_remain = 1329;
  optional int32 dev5_pv_remain = 1330;
  optional int32 dev6_pv_remain = 1331;
  optional int32 dev1_power_ability = 1332;
  optional int32 dev2_power_ability = 1333;
  optional int32 dev3_power_ability = 1334;
  optional int32 dev4_power_ability = 1335;
  optional int32 dev5_power_ability = 1336;
  optional int32 dev6_power_ability = 1337;
  optional int32 dev1_power_in_ability = 1338;
  optional int32 dev2_power_in_ability = 1339;
  optional int32 dev3_power_in_ability = 1340;
  optional int32 dev4_power_in_ability = 1341;
  optional int32 dev5_power_in_ability = 1342;
  optional int32 dev6_power_in_ability = 1343;
  optional uint32 pv_state_monitor1 = 1344;
  optional uint32 pv_state_monitor2 = 1345;
  optional uint32 dab_state_monitor1 = 1346;
  optional uint32 dab_state_monitor2 = 1347;
  optional uint32 dab_state_monitor3 = 1348;
  optional uint32 mppt_fault_comm = 1349;
  optional uint32 mppt_pv1_fault = 1350;
  optional uint32 mppt_pv2_fault = 1351;
  optional uint32 mppt_pv3_fault = 1352;
  optional uint32 mppt_pv4_fault = 1353;
  optional uint32 chg_over_cur_off_cnt = 1354;
  optional uint32 pv1_ins_rx = 1355;
  optional uint32 pv2_ins_rx = 1356;
  optional uint32 pv3_ins_rx = 1357;
  optional uint32 pv4_ins_rx = 1358;
  optional uint32 pv1_gnd_ins_ry = 1359;
  optional uint32 pv2_gnd_ins_ry = 1360;
  optional uint32 pv3_gnd_ins_ry = 1361;
  optional uint32 pv4_gnd_ins_ry = 1362;
  optional uint32 vin_pv1 = 1363;
  optional uint32 vin_pv2 = 1364;
  optional uint32 vin_pv3 = 1365;
  optional uint32 vin_pv4 = 1366;
  optional int32 iin_pv1 = 1367;
  optional int32 iin_pv2 = 1368;
  optional int32 iin_pv3 = 1369;
  optional int32 iin_pv4 = 1370;
  optional int32 pin_pv1 = 1371;
  optional int32 pin_pv2 = 1372;
  optional int32 pin_pv3 = 1373;
  optional int32 pin_pv4 = 1374;
  optional uint32 inv_todc_data = 1375;
  optional uint32 dc_to_inv_data = 1376;
  optional uint32 dab_fault = 1377;
  optional uint32 dab_fault_lock = 1378;
  optional int32 ems_pfc_chg_pwr_tag = 1379;
  optional int32 chg_power_loop_ref = 1380;
  optional int32 bms_chg_req_volt = 1381;
  optional int32 bms_chg_req_curr = 1382;
  optional int32 cur_avai_to_bms_power = 1383;
  optional int32 inv_in_power_ability_max = 1384;
  optional int32 inv_out_power_ability_max = 1385;
  optional int32 ongrid_out_power_ability_max = 1386;
  optional int32 bypass_out_power_ability_max = 1387;
  optional uint32 v_bus_hv = 1388;
  optional uint32 v_bat = 1389;
  optional int32 iout_bat = 1390;
  optional int32 i_dab_lv = 1391;
  optional uint32 v_bus_pid_ref = 1392;
  optional int32 ex_ps_d1 = 1393;
  optional int32 pv_iout_filt = 1394;
  optional int32 dc_temp1_ntc = 1395;
  optional int32 dc_temp2_ntc = 1396;
  optional int32 dc_temp3_ntc = 1397;
  optional int32 dab_lv_temp_ntc = 1398;
  optional uint32 ref1_p65 = 1399;
  optional uint32 ref2_p5 = 1400;
  optional uint32 inv_state_monitor1 = 1401;
  optional uint32 inv_state_monitor2 = 1402;
  optional uint32 inv_state_monitor3 = 1403;
  optional uint32 inv_fault = 1404;
  optional uint32 inv_fault_lock = 1405;
  optional uint32 pfc_fault = 1406;
  optional uint32 inv_comm_fault = 1407;
  optional uint32 grid_fault = 1408;
  optional uint32 inv_il1_rms = 1409;
  optional uint32 ongrid_iin_rms = 1410;
  optional int32 dcv_filt = 1411;
  optional int32 dci_filt = 1412;
  optional uint32 v_bus = 1413;
  optional uint32 ongrid_vin_rms = 1414;
  optional uint32 ongrid_vout_rms = 1415;
  optional uint32 offgrid_vout1_rms = 1416;
  optional uint32 offgrid_vout2_rms = 1417;
  optional uint32 inv_vcap_rms = 1418;
  optional int32 ac_total_active_power = 1419;
  optional int32 ongrid_in_active_power = 1420;
  optional int32 ongrid_in_reactive_power = 1421;
  optional int32 offgrid1_active_power = 1422;
  optional int32 offgrid2_active_power = 1423;
  optional int32 series_power = 1424;
  optional int32 offgrid1_apperent_power = 1425;
  optional int32 offgrid2_apperent_power = 1426;
  optional int32 offgrid_inv_derate_power = 1427;
  optional int32 ongrid_inv_derate_power = 1428;
  optional int32 ac_total_inv_derate_power = 1429;
  optional uint32 mos_volt = 1430;
  optional int32 react_pwr_ref_delta = 1431;
  optional int32 add_pwr_act_limit = 1432;
  optional uint32 volt_freqfilter = 1433;
  optional int32 inv_temp_ntc = 1434;
  optional int32 dab_high_temp_ntc = 1435;
  optional int32 ems_set_rated_power = 1436;
  optional int32 act_pwr_rated = 1437;
  optional int32 active_power_need = 1438;
  optional uint32 act_pwr_by_perc = 1439;
  optional int32 act_pwr_by_ramp_up = 1440;
  optional int32 act_pwr_by_ofdp = 1441;
  optional int32 act_pwr_by_ufip = 1442;
  optional int32 act_pwr_by_freq_droop = 1443;
  optional int32 act_pwr_by_ovdp = 1444;
  optional int32 ongrid_active_power_ref = 1445;
  optional uint32 pfc_vbus_tag = 1446;
}

message TimeAdjust {
  optional uint32 time = 1;
  optional uint32 timeZoneOffset = 2;
}

message TimeAdjustReport {
  repeated TimeAdjust adjustTask = 1;
}

message DevErrcodeList {
  repeated uint32 dev_errcode = 1;
}

enum PANEL_GRID_STA {
  PANEL_GRID_STA_NO_VAILD = 0;
  PANEL_GRID_IN = 1;
  PANEL_GRID_NOT_ONLINE = 2;
  PANEL_FEED_GRID = 3;
}

enum GRID_STD_CODE {
  GRID_STD_CODE_NULL = 0;
  GRID_STD_CODE_AUSTRIA = 1;
  GRID_STD_CODE_SWITZER = 2;
  GRID_STD_CODE_POLAND = 3;
  GRID_STD_CODE_NETHERLANDS = 4;
  GRID_STD_CODE_VDE_4105 = 5;
  GRID_STD_CODE_IEEE_1547 = 6;
  GRID_STD_CODE_USER_DEFINED = 7;
  GRID_STD_CODE_NORWAY = 8;
  GRID_STD_CODE_CZECH_REPUBLIC = 9;
  GRID_STD_CODE_DENMARK = 10;
  GRID_STD_CODE_IRELAND = 11;
  GRID_STD_CODE_SWEDEN = 12;
  GRID_STD_CODE_LATVIA = 13;
  GRID_STD_CODE_GREECE_A = 14;
  GRID_STD_CODE_GREECE_B = 15;
  GRID_STD_CODE_PORTUGAL = 16;
  GRID_STD_CODE_ROMANIA = 17;
  GRID_STD_CODE_LITHUANIA = 18;
  GRID_STD_CODE_HUNGARY = 19;
  GRID_STD_CODE_ITALY = 20;
  GRID_STD_CODE_G98 = 21;
  GRID_STD_CODE_G99 = 22;
  GRID_STD_CODE_NTS_631 = 23;
  GRID_STD_CODE_UNE_217001 = 24;
  GRID_STD_CODE_UNE_217002 = 25;
  GRID_STD_CODE_UTE_MAINLAND = 26;
  GRID_STD_CODE_UTE_50HZ_ISLAND = 27;
  GRID_STD_CODE_UTE_60HZ_ISLAND = 28;
  GRID_STD_CODE_BELGIUM = 29;
  GRID_STD_CODE_UKRAINE = 30;
  GRID_STD_CODE_SLOVENIA = 31;
  GRID_STD_CODE_BULGARIA = 32;
  GRID_STD_CODE_EU_GENERAL = 33;
  GRID_STD_CODE_NORTH_AMERICA = 1001;
}

enum METER_MODEL {
  NONE = 0;
  CT_EF_01 = 1;
  CT_SHELLY_3EM = 2;
  CT_SHELLY_PRO_3EM = 3;
  IR_TIBBER_PULSE = 4;
  IR_POWERFOX_PA201902 = 5;
  CT_EF_PRO_3EM = 6;
}

enum MASTER_AND_SLAVE {
  ELECTION = 0;
  MASTER = 1;
  SLAVE = 2;
}

message DayResidentLoadList {
  repeated ResidentLoad load = 1;
}

message ResidentLoad {
  optional uint32 startMin = 1;
  optional uint32 endMin = 2;
  optional uint32 loadPower = 3;
}

message CloudMeter {
  optional uint32 has_meter = 1;
  optional METER_MODEL model = 2;
  optional string meterSn = 3;
  optional int32 powerA = 4;
  optional int32 powerB = 5;
  optional int32 powerC = 6;
}

enum POWER_SOCKET_MODEL {
  POWER_SOCKET_NONE = 0;
  POWER_SOCKET_EF_PLUG_S_MTR_GEN_3 = 1;
}

message PowerSocket {
  optional uint32 has_selected = 1;
  optional POWER_SOCKET_MODEL model = 2;
  optional string sn = 3;
}

message PowerSocketList {
  repeated PowerSocket power_socket_cfg = 1;
}

message WifiApMeshIdInfo {
  repeated uint32 id_list = 1;
}

message CfgEnergyStrategyOperateMode {
  optional uint32 operate_self_powered_open = 1;
  optional uint32 operate_scheduled_open = 2;
  optional uint32 operate_tou_mode_open = 3;
}

message GridConnectionPortBind {
  optional string sn = 1;
  optional uint32 port_num = 2;
  optional uint32 err = 3;
}

message DeviceTargetSoc {
  string sn = 1;
  uint32 target_soc = 2;
  uint32 chg_from_grid_power_limited = 3;
}

message ChgTask {
  uint32 chg_source = 1;
  uint32 chg_mode = 2;
  repeated DeviceTargetSoc dev_target_soc = 3;
}

message TimerTask {
  uint32 role = 1;
  uint32 is_cfg = 2;
  uint32 task_index = 3;
  bool is_enable = 4;
  optional bool is_effect = 5;
  optional uint32 time_mode = 8;
  optional uint32 time_param = 9;
  repeated uint32 time_table = 10;
  optional ChgTask chg_task = 11;
  optional uint32 home_need_power_limited = 12;
}

message AllTimerTask {
  repeated TimerTask time_task = 1;
}

message ControllableLoadInfo {
  string sn = 1;
  bool enabled = 2;
  bool scheduling = 3;
}

message ControllableLoadList {
  repeated ControllableLoadInfo list = 1;
}

message DisplayPropertyUpload {
  optional uint32 energy_backup_state = 6;
  optional uint32 pcs_serial_number = 19;
  optional float pow_get_pv2 = 70;
  optional float plug_in_info_pv2_amp = 71;
  optional PowerSocketList power_socket = 75;
  optional int32 utc_timezone = 133;
  optional string utc_timezone_id = 134;
  optional uint32 utc_set_mode = 135;
  optional uint32 dev_sleep_state = 212;
  optional float bms_batt_soc = 242;
  optional float bms_batt_soh = 243;
  optional uint32 bms_design_cap = 248;
  optional uint32 bms_dsg_rem_time = 254;
  optional uint32 bms_chg_rem_time = 255;
  optional int32 bms_min_cell_temp = 258;
  optional int32 bms_max_cell_temp = 259;
  optional int32 bms_min_mos_temp = 260;
  optional int32 bms_max_mos_temp = 261;
  optional float cms_batt_soc = 262;
  optional float cms_batt_soh = 263;
  optional uint32 cms_dsg_rem_time = 268;
  optional uint32 cms_chg_rem_time = 269;
  optional uint32 cms_max_chg_soc = 270;
  optional uint32 cms_min_dsg_soc = 271;
  optional uint32 cms_bms_run_state = 275;
  optional uint32 bms_chg_dsg_state = 281;
  optional uint32 cms_chg_dsg_state = 282;
  optional float pow_get_pv = 361;
  optional uint32 plug_in_info_pv_flag = 362;
  optional int32 inv_ntc_temp3 = 371;
  optional float plug_in_info_pv_vol = 380;
  optional float plug_in_info_pv_amp = 381;
  optional CfgEnergyStrategyOperateMode energy_strategy_operate_mode = 393;
  optional uint32 plug_in_info_pv2_flag = 421;
  optional float plug_in_info_pv2_vol = 442;
  optional uint32 cms_batt_pow_out_max = 459;
  optional uint32 cms_batt_pow_in_max = 460;
  optional uint32 backup_reverse_soc = 461;
  optional uint32 cms_batt_full_energy = 462;
  optional uint32 storm_pattern_enable = 467;
  optional uint32 storm_pattern_open_flag = 468;
  optional uint32 storm_pattern_end_time = 469;
  optional float pow_get_sys_grid = 515;
  optional float pow_get_sys_load = 516;
  optional float pow_get_pv_sum = 517;
  optional float pow_get_bp_cms = 518;
  optional uint32 feed_grid_mode = 520;
  optional uint32 feed_grid_mode_pow_limit = 521;
  optional AllTimerTask all_timer_task = 584;
  optional float module_wifi_rssi = 602;
  optional float grid_connection_vol = 613;
  optional float grid_connection_freq = 615;
  optional float grid_connection_power = 616;
  optional PANEL_GRID_STA grid_connection_sta = 619;
  optional DevErrcodeList dev_errcode_list = 627;
  optional uint32 feed_grid_mode_pow_max = 727;
  optional uint32 town_code = 729;
  optional GRID_STD_CODE grid_code_selection = 730;
  optional int32 grid_code_version = 731;
  optional uint32 grid_sys_device_cnt = 758;
  optional WifiApMeshIdInfo wifi_ap_mesh_id = 759;
  optional uint32 pow_consumption_measurement = 760;
  optional CloudMeter cloud_meter = 785;
  optional TimeAdjustReport timeAdjust = 976;
  optional uint32 update_ban_flag = 977;
  optional DayResidentLoadList day_resident_load_list = 978;
  optional uint32 relay2_onoff = 980;
  optional uint32 relay4_onoff = 981;
  optional uint32 relay3_onoff = 982;
  optional uint32 relay1_onoff = 983;
  optional uint32 system_group_id = 984;
  optional int32 pow_sys_ac_out_max = 985;
  optional uint32 plug_in_info_pv3_flag = 987;
  optional uint32 plug_in_info_pv4_flag = 988;
  optional uint32 pow_sys_ac_in_max = 989;
  optional MASTER_AND_SLAVE distributed_device_status = 990;
  optional MASTER_AND_SLAVE series_connect_device_status = 991;
  optional float sys_grid_connection_power = 992;
  optional float socket_measure_power = 993;
  optional uint32 brightness = 994;
  optional uint32 system_mesh_id = 995;
  optional float pow_get_pv3 = 996;
  optional float pow_get_pv4 = 997;
  optional float plug_in_info_pv3_vol = 998;
  optional float plug_in_info_pv3_amp = 999;
  optional float plug_in_info_pv4_vol = 1000;
  optional float plug_in_info_pv4_amp = 1001;
  optional float pow_get_sys_load_from_pv = 1002;
  optional float pow_get_sys_load_from_bp = 1003;
  optional float pow_get_sys_load_from_grid = 1004;
  optional float pow_get_schuko1 = 1210;
  optional float pow_get_schuko2 = 1211;
  optional uint32 bms_batt_heating = 1212;
  optional uint32 dev_ctrl_status = 1278;
  optional int32 busbar_pow_limit = 1280;
  optional int32 max_inv_input = 1281;
  optional int32 max_inv_output = 1282;
  optional int32 max_bp_input = 1283;
  optional int32 max_bp_output = 1284;
  optional uint32 series_connect_device_id = 1285;
  optional uint32 use_lan_meter = 1292;
  optional GridConnectionPortBind grid_connection_port_bind = 1293;
  optional string socket1_bind_device_sn = 1294;
  optional string socket2_bind_device_sn = 1295;
  optional uint32 sys_offgrid = 1296;
  optional uint32 sys_grid_in_pwr_limit = 1495;
  optional uint32 socket1_pwr_in_unbind = 1496;
  optional uint32 socket2_pwr_in_unbind = 1497;
  optional uint32 feed_grid_safety_pow_max = 1543;
  optional ControllableLoadList controllable_load_list = 1549;
}

message EMSHeartbeatPack_v1p0 {
  optional uint32 chg_state = 1;
  optional uint32 chg_cmd = 2;
  optional uint32 dsg_cmd = 3;
  optional uint32 chg_vol = 4;
  optional uint32 chg_amp = 5;
  optional uint32 fan_level = 6;
  optional uint32 max_charge_soc = 7;
  optional uint32 bms_model = 8;
  optional uint32 lcd_show_soc = 9;
  optional uint32 open_ups_flag = 10;
  optional uint32 bms_warning_state = 11;
  optional uint32 chg_remain_time = 12;
  optional uint32 dsg_remain_time = 13;
  optional uint32 ems_is_normal_flag = 14;
  optional float f32_lcd_show_soc = 15;
  repeated uint32 bms_is_connt = 16;
  optional uint32 max_available_num = 17;
  optional uint32 open_bms_idx = 18;
  optional uint32 para_vol_min = 19;
  optional uint32 para_vol_max = 20;
  optional uint32 min_dsg_soc = 21;
  optional uint32 min_open_oil_eb_soc = 22;
  optional uint32 max_close_oil_eb_soc = 23;
}

message EMSHeartbeatPack_v1p3 {
  optional uint32 chg_disable_cond = 1;
  optional uint32 dsg_disable_cond = 2;
  optional uint32 chg_line_plug_in_flag = 3;
  optional uint32 sys_chg_dsg_state = 4;
  optional uint32 ems_heartbeat_ver = 5;
}

message CMSHeartBeatReport {
  optional EMSHeartbeatPack_v1p0 v1p0 = 1;
  optional EMSHeartbeatPack_v1p3 v1p3 = 2;
}

message BMSHeartBeatReport {
  optional uint32 num = 1;
  optional uint32 type = 2;
  optional uint32 cell_id = 3;
  optional uint32 err_code = 4;
  optional uint32 sys_ver = 5;
  optional uint32 soc = 6;
  optional uint32 vol = 7;
  optional int32 amp = 8;
  optional int32 temp = 9;
  optional uint32 open_bms_flag = 10;
  optional uint32 design_cap = 11;
  optional uint32 remain_cap = 12;
  optional uint32 full_cap = 13;
  optional uint32 cycles = 14;
  optional uint32 soh = 15;
  optional uint32 max_cell_vol = 16;
  optional uint32 min_cell_vol = 17;
  optional int32 max_cell_temp = 18;
  optional int32 min_cell_temp = 19;
  optional int32 max_mos_temp = 20;
  optional int32 min_mos_temp = 21;
  optional uint32 bms_fault = 22;
  optional uint32 bq_sys_stat_reg = 23;
  optional uint32 tag_chg_amp = 24;
  optional float f32_show_soc = 25;
  optional uint32 input_watts = 26;
  optional uint32 output_watts = 27;
  optional uint32 remain_time = 28;
  optional uint32 mos_state = 29;
  optional uint32 balance_state = 30;
  optional uint32 max_vol_diff = 31;
  optional uint32 cell_series_num = 32;
  repeated uint32 cell_vol = 33;
  optional uint32 cell_ntc_num = 34;
  repeated int32 cell_temp = 35;
  optional string hw_ver = 36;
  optional uint32 bms_heartbeat_ver = 37;
  optional uint32 ecloud_ocv = 38;
  optional string bms_sn = 39;
  optional uint32 product_type = 40;
  optional uint32 product_detail = 41;
  optional float act_soc = 42;
  optional float diff_soc = 43;
  optional float target_soc = 44;
  optional uint32 sys_loader_ver = 45;
  optional uint32 sys_state = 46;
  optional uint32 chg_dsg_state = 47;
  optional uint32 all_err_code = 48;
  optional uint32 all_bms_fault = 49;
  optional uint32 accu_chg_cap = 50;
  optional uint32 accu_dsg_cap = 51;
  optional float real_soh = 52;
  optional float calendar_soh = 53;
  optional float cycle_soh = 54;
  optional uint32 mos_ntc_num = 55;
  repeated int32 mos_temp = 56;
  optional uint32 env_ntc_num = 57;
  optional uint32 heatfilm_ntc_num = 59;
  optional uint32 cur_sensor_ntc_num = 61;
  optional int32 max_env_temp = 63;
  optional int32 min_env_temp = 64;
  optional int32 max_heatfilm_temp = 65;
  optional int32 min_heatfilm_temp = 66;
  optional int32 max_cur_sensor_temp = 67;
  optional int32 min_cur_sensor_temp = 68;
  optional uint32 balance_cmd = 69;
  optional uint32 remain_balance_time = 70;
  optional uint32 afe_sys_status = 71;
  optional uint32 mcu_pin_in_status = 72;
  optional uint32 mcu_pin_out_status = 73;
  optional uint32 bms_alarm_state1 = 74;
  optional uint32 bms_alarm_state2 = 75;
  optional uint32 bms_protect_state1 = 76;
  optional uint32 bms_protect_state2 = 77;
  optional uint32 bms_fault_state = 78;
  optional uint32 accu_chg_energy = 79;
  optional uint32 accu_dsg_energy = 80;
  optional string pack_sn = 81;
  optional uint32 water_in_flag = 82;
}
`;

export function parseProtocol(): IParserResult {
  return parse(PROTOCOL_SOURCE);
}
