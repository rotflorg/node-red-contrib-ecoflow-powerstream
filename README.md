# Ecoflow Node Red module

A Node Red module that allows conversion and aggregation of:
* Ecoflow PowerStream micro inverter from binary MQTT messages to user-readable JSON.
* Ecoflow Delta 2 Max power station (aggregation only, as data is transmitted
  already in JSON format).

The aggregation currently concentrates on main core vital values for the system
PowerStream in combination with a power station. There are plans to expand this
project, but for now, there is nothing more. Contributions are welcome.

## Output message types

In the editor of the node, you can configure the "Output message types". This defines
the types of messages generated by this node from the binary (buffer) input messages
received via MQTT. The following types exist:
* Aggregated only: Only the aggregated information as JSON is generated (see below)
* Translated only: Only the binary message translation to JSON is generated,
  this contains the binary data translated to human-readable JSON.
* Both: Both types of messages listed above are generated by this plugin.

## Aggregated information

The node tries to generate the following information from the binary data:
* batInputVolt: The charging state of the connected battery, in volts (future
  releases should also provide a percentage value calculated from the volts).
* batInputWatts: The power (in watts) coming from the battery to the inverter
  (positive value) or going from the inverter to charge the battery (negative
  value).
* invOutputWatts: The watts ingested into the household network by the inverter.
* pv1InputWatts: The watts generated by the solar module plugged into PV1 input.
* pv2InputWatts: The watts generated by the solar module plugged into PV2 input.
* pv1OpVolt: The voltage generated by the solar module plugged into PV1 input.
* pv2OpVolt: The voltage generated by the solar module plugged into PV2 input.

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
