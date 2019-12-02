 /**
 * Implements JavaScript functions that extend Snap! to use WebRTC for communication
 * Authors: Ken Kahn
 * License: New BSD
 */

'use strict';
window.webrtc = 
 (function () {
      const connection_settings = // useful if need to go through NATs to get IP addresses
          {iceServers: [{urls: ['stun:stun.l.google.com:19302']}]};
      let connection = new RTCPeerConnection(connection_settings);
      let connection_key;
      let callback_when_connection_key;
      const on_ice_candidate = (event) => {
          if (!event.candidate) {
              create_key(connection.localDescription);
          }
      };
      const create_key = (description) => {
          connection_key = encodeURIComponent(JSON.stringify(description));
//           console.log(connection_key);
          // commented out since causes FireFox exception - since not DIRECTLY triggered by user
//           navigator.clipboard.writeText(connection_key);
          invoke_callback(callback_when_connection_key, connection_key);  
      };
      const create_connection_offer = (success_callback, error_callback) => {
          callback_when_connection_key = success_callback;
          const got_description = (description) => {
              connection.setLocalDescription(description);
          };
          const create_session_error = (error) => {
              invoke_callback(error_callback, 'Failed to create session description: ' + error.toString());
          };
          connection.createOffer().then(got_description, create_session_error);
      };
      const on_ice_candidate_state_change = () => {
          console.log("iceConnectionState is " + connection.iceConnectionState);
      }
      connection.onicecandidate = on_ice_candidate;
      connection.oniceconnectionstatechange  = on_ice_candidate_state_change;
      const accept_connection_offer = (encoded_description_json, success_callback, error_callback) => {
          callback_when_connection_key = success_callback;
          let description;
          try {
              description = JSON.parse(decodeURIComponent(encoded_description_json));
          } catch (error) {
              invoke_callback(error_callback, "It seems this isn't a connection key offer: " + encoded_description_json);
              return;
          }
          const got_answer = (description) => {
              connection.setLocalDescription(description);
          };
          const accept_offer_error = (error) => {
              invoke_callback(error_callback, 'Failed to accept offer: ' + error.toString());
          };
          const create_answer = () => {
              connection.createAnswer().then(got_answer, accept_offer_error);
          };
          const description_object = new RTCSessionDescription(description);
          connection.setRemoteDescription(description_object).then(create_answer, error_callback);
      };
      const accept_answer = (encoded_description_json, success_callback, error_callback) => {
          let description;
          try {
              description = JSON.parse(decodeURIComponent(encoded_description_json));
          } catch (error) {
              invoke_callback(error_callback, "It seems this isn't a connection key response: " + encoded_description_json);
          }
          connection.setRemoteDescription(description).then(
              () => {
                  invoke_callback(success_callback, "Connection ready");
              },
              (error) => {
                  invoke_callback(error_callback, "Failed to set remote connection: " + error.toString());
              });                
      }
      let send_channel = connection.createDataChannel('data channel');
      send_channel.onopen = () => {
          console.log("Send channel opened.");
      };
      const multi_part_message_token = "***multi-part message***";
      const send_data = (data, error_callback) => {
          if (send_channel.readyState === "connecting") {
                // try again in a second
              setTimeout(() => {
                  send_data(data, error_callback);
              },
              1000);
              return;
          }
          try {
              const message = typeof data === 'string' ? data : JSON.stringify(data);
              const maximum_message_size = connection.sctp.maxMessageSize;
              const number_of_parts = Math.ceil(message.length/maximum_message_size);
              if (number_of_parts > 1) {
                  send_channel.send(multi_part_message_token + number_of_parts);
                  for (let i = 0; i < number_of_parts; i++) {
                      send_channel.send(message.slice(i*maximum_message_size, (i+1)*maximum_message_size));
                  }
              } else {
                  send_channel.send(message);
              }
          } catch (error) {
              invoke_callback(error_callback, error.toString());
          }
      };
      let receive_channel;
      let data_listener = console.log; // default if nothing provided
      let process_parsed_message;
      const on_message = (listener) => {
          data_listener = listener;
      };
      const set_process_parsed_message = (f) => {
          process_parsed_message = f;
      };
      let remaining_message_parts;
      let message_so_far = null;
      const on_receive_data = (event) => {
          receive_channel = event.channel;
          receive_channel.onmessage = (event) => {
              let message = event.data;
              const maximum_message_size = connection.sctp.maxMessageSize;
              const is_multi_part_message = message.indexOf(multi_part_message_token) === 0;
              if (is_multi_part_message && message_so_far === null) {
                  // start of multi-part message
                  message_so_far = "";
                  remaining_message_parts = +message.slice(multi_part_message_token.length);
                  return;                      
              }
              if (message_so_far !== null) { 
                  remaining_message_parts--;
                  message_so_far += message;
                  if (remaining_message_parts === 0) {
                      message = message_so_far;
                      message_so_far = null; 
                  } else {
                      return; // do nothing until rest of message arrives
                  }
              } // else single part message
              try {
                  let parsed_message = JSON.parse(message);
                  if (process_parsed_message) {
                      parsed_message = process_parsed_message(parsed_message);
                  }
                  invoke_callback(data_listener, parsed_message);
              } catch (error) {
                  invoke_callback(data_listener, message); 
              }
          };
      };
      connection.ondatachannel = on_receive_data;
      const close_connection = () => {
          if (send_channel) {
              send_channel.close();
          }
          if (receive_channel) {
              receive_channel.close();
          }
          connection.close();
      }
      return {create_connection_offer,
              accept_connection_offer,
              accept_answer,
              send_data,
              on_message,
              close_connection,
              set_process_parsed_message};

  } ());
