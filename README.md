# Ecoflow Node Red module

A Node Red module that allows conversion of Ecoflow Powerstream micro inverter from
binary MQTT messages to user-readable JSON. There are plans to expand this project,
but for now there is nothing more.

## Connect MQTT

Use a regular MQTT input for Node Red. Forward that input to the ecoflow-powerstream
function defined by this plugin.

### Get login details

Use [this bash script](https://github.com/mmiller7/ecoflow-withoutflow/blob/main/cloud-mqtt/ecoflow_get_mqtt_login.sh)
to get your login details. It will spit out protocol, host, port, username and password.

### Configure the MQTT input node

Add a new server, configure as follows:

Tab "Connection":
* Server: host from bash script output, e.g. mqtt-e.ecoflow.com
* Port: port from bash script output, e.g. 8884
* Connect automatically: yes
* TLS: ys
* Protocol: MQTT V3.1.1
* Client-ID: output from bash script
* Keep-Alive: 60
* Clean session: yes

Tab "Security":
* User name from bash script output
* Password from bash script output

Back in the "mqtt in" node, set:
* Action: Subscribe to single topic
* Topic: "/app/device/property/" + PowerStream searial number
* QoS: 2
* Output: binary buffer
