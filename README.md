# Ecoflow Node Red module

A Node Red module that allows conversion and aggregation of MQTT data generated
by Ecoflow devices.

The aggregation currently concentrates on main core vital values for the system
PowerStream in combination with a power station. There are plans to expand this
project, but for now, there is nothing more. Contributions are welcome.

## Supported device types

In the editor for the node, you need to configure your device type. The following
devices are currently supported:
* Ecoflow PowerStream micro inverter from binary MQTT messages to user-readable
  JSON.
* Ecoflow Delta 2 Max power station (aggregation only, as data is transmitted
  already in JSON format).


## Output message types

In the editor of the node, you can configure the "Output message types". This defines
the types of messages generated by this node from the binary (buffer) input messages
received via MQTT. The following types exist:
* Aggregated only: Only the aggregated information as JSON is generated (see below)
* Translated only: Only the binary message translation to JSON is generated,
  this contains the binary data translated to human-readable JSON.
* Both: Both types of messages listed above are generated by this plugin.

## Aggregated information

As the input data consists of different values that are updated by different
messages in different intervals, it comes in handy to have an aggregated messages
that combines the current values of all relevant variables. Additionaly, there
is an associated timeout for each input variable that resets it back to zero if
it is not updated anymore (e.g. the sending device looses network connection or
has no power).

This section describes the generated aggregated information by the node. The
aggregated messages have a topic to which "/aggregated" is appended as suffix.

### PowerStream

* batInputVolt: The charging state of the connected battery, in volts.
* batSoc: The charging state of the connected battery, in percent. Note:
  this value is updated very rarely, so it can take a few minutes until it becomes
  available.
* batInputWatts: The power (in watts) coming from the battery to the inverter
  to be ingested into the household network (positive value) or going from the
  inverter to charge the battery (negative value).
* invOutputWatts: The watts ingested into the household network by the inverter.
* pv1InputWatts: The watts generated by the solar module plugged into PV1 input.
* pv2InputWatts: The watts generated by the solar module plugged into PV2 input.
* pv1OpVolt: The voltage generated by the solar module plugged into PV1 input.
* pv2OpVolt: The voltage generated by the solar module plugged into PV2 input.

### Delta 2 Max

* bms_emsStatus_f32LcdShowSoc: The overall charging state of the battery
  (average, if you have multiple batteries).
* bms_bmsStatus_f32ShowSoc: The charging state of the power station internal battery.
* bms_bmsStatus_vol: The charging state of the power station internal battery,
  in volts.
* bms_kitInfo_watts0: the power going out (positive value) or coming in (negative
  value) from the first battery connector (external battery, micro inverter, etc.)
* bms_kitInfo_watts1: the power going out (positive value) or coming in (negative
  value) from the second battery connector (external battery, micro inverter, etc.)
* mppt_inWatts: the power coming in from the PV solar panel in plug 1.
* mppt_pv2InWatts: the power coming in from the PV solar panel in plug 2.
* mppt_pvInputWatts: the combined power coming in from all PV solar panels attached
  directly to the power station.
* inv_inputWatts: the power station internal inverter, input power.
* inv_outputWatts: the power station internal inverter, output power.

## Connect MQTT

Use a regular MQTT input for Node Red. Forward that input to the ecoflow-powerstream
function defined by this plugin.

### Get login details

Use [this bash script](https://github.com/mmiller7/ecoflow-withoutflow/blob/main/cloud-mqtt/ecoflow_get_mqtt_login.sh)
to get your login details. It will spit out protocol, host, port, username and password
(and a lot more information you don't need right now). Alternatively, you can use
[this web site](https://energychain.github.io/site_ecoflow_mqtt_credentials/).

### Configure the MQTT input node

Add a new server, configure as follows:

Tab "Connection":
* Server: host from bash script output, e.g. mqtt-e.ecoflow.com
* Port: port from bash script output, e.g. 8884
* Connect automatically: yes
* TLS: yes
* Protocol: MQTT V3.1.1
* Client-ID: output from bash script
* Keep-Alive: 60
* Clean session: yes

Tab "Security":
* User name from bash script output
* Password from bash script output

Back in the "mqtt in" node, set:
* Action: Subscribe to single topic
* Topic: "/app/device/property/" + PowerStream serial number
* QoS: 0
* Output: binary buffer
