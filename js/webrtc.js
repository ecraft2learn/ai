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
          const description = JSON.parse(decodeURIComponent(encoded_description_json));
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
          const description = JSON.parse(decodeURIComponent(encoded_description_json));
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
      const send_data = (data, success_callback, error_callback) => {
          // deal with maximum size message? connection.sctp.maxMessageSize
          send_channel.send(data);
      };
      let receive_channel;
      let data_listener = console.log; // default if nothing provided
      const on_message = (listener) => {
          data_listener = listener;
      };
      const on_receive_data = (event) => {
          receive_channel = event.channel;
          receive_channel.onmessage = (event) => {
              invoke_callback(data_listener, event.data);
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
              test: () => connection};

  } ());

