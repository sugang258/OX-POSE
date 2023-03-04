// HTML에서 <video> 태그와 <canvas> 태그를 가져옴
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];

// MediaPipe Pose 모델 로딩
const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  }
});
pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
pose.onResults(onPose);

// 비디오 프레임 처리 및 랜드마크 그리기
function processVideo() {
  pose.send({image: videoElement});
  canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
  requestAnimationFrame(processVideo);
}

// MediaPipe Pose 결과를 이용하여 랜드마크 그리기
function onPose(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  //canvasCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
  if (results.poseLandmarks) {
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                 {color: '#00FF00', lineWidth: 4});
    drawLandmarks(canvasCtx, results.poseLandmarks,
                {color: '#FF0000', lineWidth: 2});
    //drawLandmarks(results.poseLandmarks);
  }
  console.log("yessss");
  canvasCtx.restore();
}

// 랜드마크 그리기 함수
function drawLandmarks(landmarks) {
  for (let i = 0; i < landmarks.length; i++) {
    const landmark = landmarks[i];
    canvasCtx.beginPath();
    canvasCtx.arc(landmark.x * canvasElement.width, landmark.y * canvasElement.height, 5, 0, 2 * Math.PI);
    canvasCtx.fill();
  }
}

// 비디오 재생 후, 프레임 처리 시작
videoElement.onloadedmetadata = () => {
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;
  canvasCtx = canvasElement.getContext('2d');
  processVideo();
};
//videoElement.src = './video/test2.mp4';

