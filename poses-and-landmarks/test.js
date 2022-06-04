let faces;

document.addEventListener('DOMContentLoaded',
                          (event) => {
const video = document.querySelector('video');
                            
navigator.mediaDevices.getUserMedia({audio: false,
                                     video: true})
    .then((stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
            video.play();
            const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
            const detectorConfig = {
              runtime: 'tfjs',
            };
            const detector = faceLandmarksDetection.createDetector(model, detectorConfig)
              .then((detector) => {
                  const estimationConfig = {staticImageMode: true};
                  detector.estimateFaces(video, estimationConfig)
                     .then((result) => {
                              faces = result;
                              console.log(faces);                     
                           });
                  });
                };
    })
})