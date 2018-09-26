  // support for compiling Snap4Arduino to Arduino sketch using ArduinoBot
  // see https://github.com/ecraft2learn/arduinobot
ecraft2learn.send_blocks_to_arduinobot = function (blocks, alternative_server) {
    // alternative_server should be provided if the default raspberrypi.local isn't working
    let expression = blocks.expression;
    try {
        ecraft2learn.arduino_bot.verify(
               world.Arduino.transpile(
                 "void setup() {" + expression.mappedCode(),
                 expression.children.filter(
                     function (each) {
                           return each instanceof HatBlockMorph &&
                                  each.selector == 'receiveMessage'
                      })),
                 true);
     } catch (error) {
         alert("Error exporting to Arduino sketch!  " + error.message)
     }
};

ecraft2learn.arduino_bot = // based upon https://github.com/evothings/ecraft2learn/blob/master/arduinobot/client/app.js
        (function () {
  /* global $ */

  // Constants
  var defaultPortNumber = 1884

  // MQTT
  var mqttClient = null
  var editor = null
  var sketch = 'blinky'
  var server = 'raspberrypi.local:1884'

  var onConnectSuccessListeners = [];

  function addConnectSuccessListener (listener) {
    onConnectSuccessListeners.push(listener)
  }

//   document.addEventListener("deviceready", onDeviceReady, false);

//   function onDeviceReady () {
//     connect()
//   }

  function connect (alternative_server) {
    if (alternative_server) {
        server = alternative_server
    }
    disconnectMQTT()
    connectMQTT()
    // console.log('info', '', 'Connecting to MQTT ...', true)
  }

  // We need a unique client id when connecting to MQTT
  function guid () {
    function s4 () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
  }

  function connectMQTT () {
    var clientID = guid()
    var portNumber = defaultPortNumber
    var serverAndPort = server.split(':')
    if (serverAndPort.length === 2) {
      portNumber = parseInt(serverAndPort[1])
    }
    mqttClient = new window.Paho.MQTT.Client(serverAndPort[0], portNumber, clientID)
    mqttClient.onConnectionLost = onConnectionLost
    mqttClient.onMessageArrived = onMessageArrived
    var options =
      {
        userName: 'test',
        password: 'test',
        useSSL: false,
        reconnect: true,
        onSuccess: onConnectSuccess,
        onFailure: onConnectFailure
      }
    mqttClient.connect(options)
  }

  function verify (source, upload) {
    // Select command
    var command = 'verify'
    if (upload) {
      command = 'upload'
    }

    // Generate an id for the response we want to get
    var responseId = guid()

    // Subscribe in advance for that response
    subscribe('response/' + command + '/' + responseId)

    // Construct a job to run
    var job = {
      'sketch': sketch + '.ino',
      'src': window.btoa(source)
    }

    // Save sketch
    publish('sketch/' + sketch, job, true)

    // Submit job
    publish(command + '/' + responseId, job)
  }

  function handleResponse (topic, payload) {
    var jobId = payload.id
    subscribe('result/' + jobId)
    unsubscribe(topic)
  }

  function handleResult (topic, payload) {
    var type = payload.type
    var command = payload.command
    unsubscribe(topic)
    if (type === 'success') {
//       console.log('Exit code: ' + payload.exitCode)
//       console.log('Stdout: ' + payload.stdout)
//       console.log('Stderr: ' + payload.stderr)
//       console.log('Errors: ' + JSON.stringify(payload.errors))
      if (payload.exitCode === 0) {
        if (command === 'verify') {
          console.log('success', 'Success!', 'No compilation errors')
        } else {
          console.log('success', 'Success!', 'No compilation errors and upload was performed correctly')
        }
      } else {
        if (command === 'verify') {
          console.log('danger', 'Failed!', 'Compilation errors detected: ' + payload.errors.length)
        } else {
          console.log('danger', 'Failed!', 'Compilation errors detected: ' + payload.errors.length + '. Upload not performed')
        }
      }
    } else {
      console.log('danger', 'Failed!', 'Job failed: ' + payload.message)
    }
  }

  function onMessageArrived (message) {
    var payload = JSON.parse(message.payloadString)
//     console.log('Topic: ' + message.topic + ' payload: ' + message.payloadString)
    handleMessage(message.topic, payload)
  }

  function onConnectSuccess (context) {
//     console.log('info', '', 'Connected', true)
    subscribeToSketch()
    onConnectSuccessListeners.forEach(function (listener) { listener()})
  }

  function onConnectFailure (error) {
    console.log('Failed to connect: ' + JSON.stringify(error))
    console.log('danger', 'Connect failed!', 'Reconnecting ...', true)
  }

  function onConnectionLost (responseObject) {
    console.log('Connection lost: ' + responseObject.errorMessage)
    console.log('warning', 'Connection was lost!', 'Reconnecting ...', true)
  }

  function publish (topic, payload, retained) {
    var message = new window.Paho.MQTT.Message(JSON.stringify(payload))
    message.destinationName = topic
    message.retained = !!retained
    mqttClient.send(message)
  }

  function subscribe (topic) {
    mqttClient.subscribe(topic)
//     console.log('Subscribed: ' + topic)
  }

  function subscribeToSketch () {
    subscribe('sketch/' + sketch)
  }

  function unsubscribe (topic) {
    mqttClient.unsubscribe(topic)
//     console.log('Unsubscribed: ' + topic)
  }

  function disconnectMQTT () {
    if (mqttClient && mqttClient.isConnected()) {
      mqttClient.disconnect()
    }
    mqttClient = null
  }

  function handleMessage (topic, payload) {
    try {
      if (topic.startsWith('response/')) {
        return handleResponse(topic, payload)
      } else if (topic.startsWith('result/')) {
        return handleResult(topic, payload)
      } else if (topic.startsWith('sketch/')) {
        return // ignore
      }
      console.log('Unknown topic: ' + topic)
    } catch (error) {
      console.log('Error handling payload: ' + error)
    }
  }

  // return external interface to ArduinoBot
  return {connect: connect,
          verify:  verify,
          addConnectSuccessListener: addConnectSuccessListener}
})();