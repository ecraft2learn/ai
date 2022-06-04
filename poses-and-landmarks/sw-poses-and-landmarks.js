importScripts('/ai/js/service-worker-utilities.js');

const cache_name = 'snap-poses-and-landmarks-v1',
    files_to_cache = [
"/ai/poses-and-landmarks/index.html?",
"/ai/js/tfjs.js",
"/ai/js/translate.js",
"/ai/poses-and-landmarks/poses-and-landmarks.js",
"https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection",
"https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/detector/full/1/model.json?tfjs-format=file",
"https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/landmark/full/1/model.json?tfjs-format=file",
"https://storage.googleapis.com/tfhub-tfjs-modules/mediapipe/tfjs-model/handpose_3d/detector/full/1/model.json",
"https://storage.googleapis.com/tfhub-tfjs-modules/mediapipe/tfjs-model/handpose_3d/landmark/full/1/model.json",
"https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/detector/full/1/group1-shard1of1.bin?tfjs-format=file",
"https://storage.googleapis.com/tfhub-tfjs-modules/mediapipe/tfjs-model/handpose_3d/detector/full/1/group1-shard1of1.bin",
"https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/landmark/full/1/group1-shard1of2.bin?tfjs-format=file",
"https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/landmark/full/1/group1-shard2of2.bin?tfjs-format=file",
"https://storage.googleapis.com/tfhub-tfjs-modules/mediapipe/tfjs-model/handpose_3d/landmark/full/1/group1-shard1of2.bin",
"https://storage.googleapis.com/tfhub-tfjs-modules/mediapipe/tfjs-model/handpose_3d/landmark/full/1/group1-shard2of2.bin",
"https://cdn.jsdelivr.net/npm/@tensorflow-models/face-detection",
"https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1/model.json?tfjs-format=file",
"https://storage.googleapis.com/tfhub-tfjs-modules/mediapipe/tfjs-model/face_detection/short/1/model.json",
"https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1/group1-shard1of1.bin?tfjs-format=file",
"https://storage.googleapis.com/tfhub-tfjs-modules/mediapipe/tfjs-model/face_detection/short/1/group1-shard1of1.bin",
"https://cdn.jsdelivr.net/npm/@tensorflow-models/face-landmarks-detection",
"https://tfhub.dev/mediapipe/tfjs-model/face_landmarks_detection/face_mesh/1/model.json?tfjs-format=file",
"https://storage.googleapis.com/tfhub-tfjs-modules/mediapipe/tfjs-model/face_landmarks_detection/face_mesh/1/model.json",
"https://tfhub.dev/mediapipe/tfjs-model/face_landmarks_detection/face_mesh/1/group1-shard1of1.bin?tfjs-format=file",
"https://storage.googleapis.com/tfhub-tfjs-modules/mediapipe/tfjs-model/face_landmarks_detection/face_mesh/1/group1-shard1of1.bin",
"https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection",
"https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4/model.json?tfjs-format=file",
"https://storage.googleapis.com/tfhub-tfjs-modules/google/tfjs-model/movenet/singlepose/lightning/4/model.json",
"https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4/group1-shard1of2.bin?tfjs-format=file",
"https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4/group1-shard2of2.bin?tfjs-format=file",
"https://storage.googleapis.com/tfhub-tfjs-modules/google/tfjs-model/movenet/singlepose/lightning/4/group1-shard1of2.bin",
"https://storage.googleapis.com/tfhub-tfjs-modules/google/tfjs-model/movenet/singlepose/lightning/4/group1-shard2of2.bin",
"https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/float/100/model-stride16.json",
"https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/float/100/group1-shard1of4.bin",
"https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/float/100/group1-shard2of4.bin",
"https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/float/100/group1-shard3of4.bin",
"https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/float/100/group1-shard4of4.bin",
"https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/detector/1/model.json?tfjs-format=file",
"https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/full/2/model.json?tfjs-format=file",
"https://storage.googleapis.com/tfhub-tfjs-modules/mediapipe/tfjs-model/blazepose_3d/landmark/full/2/model.json",
"https://storage.googleapis.com/tfhub-tfjs-modules/mediapipe/tfjs-model/blazepose_3d/detector/1/model.json",
"https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/detector/1/group1-shard1of2.bin?tfjs-format=file",
"https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/detector/1/group1-shard2of2.bin?tfjs-format=file",
"https://storage.googleapis.com/tfhub-tfjs-modules/mediapipe/tfjs-model/blazepose_3d/detector/1/group1-shard1of2.bin",
"https://storage.googleapis.com/tfhub-tfjs-modules/mediapipe/tfjs-model/blazepose_3d/detector/1/group1-shard2of2.bin",
"https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/full/2/group1-shard1of2.bin?tfjs-format=file",
"https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/full/2/group1-shard2of2.bin?tfjs-format=file",
"https://storage.googleapis.com/tfhub-tfjs-modules/mediapipe/tfjs-model/blazepose_3d/landmark/full/2/group1-shard1of2.bin",
"https://storage.googleapis.com/tfhub-tfjs-modules/mediapipe/tfjs-model/blazepose_3d/landmark/full/2/group1-shard2of2.bin",

];

self.addEventListener('install', (event) => {
    install_listener(event, cache_name, files_to_cache);
});

self.addEventListener('activate', (event) => {
    active_listener (event, cache_name);
    self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    fetch_listener (event)
});


