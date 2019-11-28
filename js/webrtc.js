 /**
 * Implements JavaScript functions that extend Snap! to use WebRTC for communication
 * Authors: Ken Kahn
 * License: New BSD
 */

'use strict';
window.webrtc = 
  (function () {
       const connection_settings = 
           {iceServers: [{urls: ['stun:stun.l.google.com:19302']}]};
      let connection = new RTCPeerConnection(connection_settings);
      const on_ice_candidate = (event) => {
            // following https://jameshfisher.com/2017/01/16/tiny-serverless-webrtc/
//             if (!event.candidate) {
//                   console.log(JSON.stringify(connection.localDescription));
//             }
//           if (event.candidate) {
//               connection.addIceCandidate(event.candidate).then(
//                   () => {
//                       console.log("addIceCandidate succeeded");
//                   },
//                   (error) => {
//                       throw new Error('Failed to add Ice Candidate: ' + error.toString());
//                   });
//           };
      };
      const create_key = (description) => {
          const connection_key = encodeURIComponent(JSON.stringify(description));
          console.log(connection_key);
          // commented out since causes FireFox exception
//           navigator.clipboard.writeText(connection_key);    
      };
      const create_connection_offer = (success_callback, error_callback) => {
          const got_description = (description) => {
              connection.setLocalDescription(description);
              create_key(description);
              invoke_callback(success_callback, "Connection information on your clipboard. Send it to your collaborator.");
//               connection.onicecandidate = on_ice_candidate;
          };
          const create_session_error = (error) => {
              invoke_callback(error_callback, 'Failed to create session description: ' + error.toString());
          };
          connection.createOffer().then(got_description, create_session_error);
      };
      connection.onicecandidate = on_ice_candidate;
      const accept_connection_offer = (encoded_description_json, success_callback, error_callback) => {
//           connection.onicecandidate = on_ice_candidate;
          const description = JSON.parse(decodeURIComponent(encoded_description_json));
          const got_answer = (description) => {
              connection.setLocalDescription(description);
              create_key(description);
              invoke_callback(success_callback, "Clipboard has connection information. ...");
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
//           connection.onicecandidate = on_ice_candidate;
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
              test: () => { connection.onicecandidate = on_ice_candidate;}};

  } ());

