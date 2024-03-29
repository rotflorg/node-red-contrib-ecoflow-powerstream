// Protocol definition taken from:
// https://forum.iobroker.net/assets/uploads/files/1704442310021-ecoflow-connector_v121.txt

import { IParserResult, parse } from 'protobufjs';


export const PROTOCOL_SOURCE = `
syntax = "proto3";
message Message {
  repeated Header header = 1 ;
  bytes payload = 2;
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

message Send_Header_Msg {
  optional Header msg = 1;
}

message SendMsgHart {
  optional int32 link_id = 1;
  optional int32 src = 2;
  optional int32 dest = 3;
  optional int32 d_src = 4;
  optional int32 d_dest = 5;
  optional int32 enc_type = 6;
  optional int32 check_type = 7;
  optional int32 cmd_func = 8;
  optional int32 cmd_id = 9;
  optional int32 data_len = 10;
  optional int32 need_ack = 11;
  optional int32 is_ack = 12;
  optional int32 ack_type = 13;
  optional int32 seq = 14;
  optional int32 time_snap = 15;
  optional int32 is_rw_cmd = 16;
  optional int32 is_queue = 17;
  optional int32 product_id = 18;
  optional int32 version = 19;
}
`;

export function parseProtocol(): IParserResult {
  return parse(PROTOCOL_SOURCE);
}
