// const videoElement = document.getElementsByClassName('input_video')[0];
// const canvasElement = document.getElementsByClassName('output_canvas')[0];
// const canvasCtx = canvasElement.getContext('2d');
// const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
// const grid = new LandmarkGrid(landmarkContainer);

// function onResults(results) {
//   console.log(results.poseWorldLandmarks);
//   //result : pose_landmarks / pose_world_landmarks
//   //pose_landmarks : 포즈 랜드마크 목록
//   //pose_world_landmarks : 세계 좌표의 또 다른 포즈 랜드마크 목록
//   if (!results.poseLandmarks) {
//     grid.updateLandmarks([]);
//     return;
//   }

//   canvasCtx.save();
//   canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

//   //globalCompositeOperation : 캔버스에 그리려는 색이 그려져 있던 색과 겹쳐질 때 어떤식으로 조합할지 지정
//   // source-in : 대상값과 겹쳐진 부분만; 즉 나중에 그려진 도형의 겹쳐지는 부분만 표시됨
//   canvasCtx.globalCompositeOperation = 'source-in';
//   canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

//   // destination-atop : 대상 그림과 겹쳐진 부분만; 즉 나중에 그려진 도형 영역만 표시
//   // -> 겹쳐진 부분은 처음 그려진 도형이 표시
//   canvasCtx.globalCompositeOperation = 'destination-atop';
//   canvasCtx.drawImage(
//       results.image, 0, 0, canvasElement.width, canvasElement.height);

//   // source-over : 기본값, 대상값이 위로; 즉 처음 그려진 도형 위에 나중에 그려진 도형이 표시 됨
//   canvasCtx.globalCompositeOperation = 'source-over';
//   drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
//                  {color: '#00FF00', lineWidth: 4});
//   drawLandmarks(canvasCtx, results.poseLandmarks,
//                 {color: '#FF0000', lineWidth: 2});
//   canvasCtx.restore();

//   grid.updateLandmarks(results.poseWorldLandmarks);
// }

// const pose = new Pose({locateFile: (file) => {
//   return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
// }});
// pose.setOptions({
//   modelComplexity: 1, //모델 복잡성 기본값:1
//   smoothLandmarks: true,
//   enableSegmentation: true, //포즈 랜드마크 외에도 솔루션 분할 마스크 생성
//   smoothSegmentation: true, // enableSegmentation false이면 적용 X
//   minDetectionConfidence: 0.5, //감지에 대한 사람 감지 모델의 최소 신뢰 값
//   minTrackingConfidence: 0.5 //랜드마크 추적 모델의 최소 신뢰 값
// });
// pose.onResults(onResults);

// const camera = new Camera(videoElement, {
//   onFrame: async () => {
//     await pose.send({image: videoElement});
//   },
//   width: 1280,
//   height: 720
// });
// camera.start();


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

