
// MediaPipe Pose 모델 로딩
var pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  }
});


var videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];


$('#chooseVideo').change(analysis); // 동영상 선택시
analysis(); // 페이지 실행시 첫 실행
function analysis() {
    	videoElement.pause();
	  	videoElement.setAttribute("src", $('#chooseVideo').val());
	  	pose.reset();
	  	pose.setOptions({
		  modelComplexity: 1,
		  smoothLandmarks: true,
		  enableSegmentation: false,
		  minDetectionConfidence: 0.5,
		  minTrackingConfidence: 0.5
		});
	  	pose.onResults(onPose);
	 	videoElement.load();
   		
   		// 비디오 재생 후, 프레임 처리 시작
	videoElement.onloadedmetadata = () => {
	  canvasElement.width = videoElement.videoWidth;
	  canvasElement.height = videoElement.videoHeight;
	  canvasCtx = canvasElement.getContext('2d');
	  processVideo();
	};
}
// 비디오 프레임 처리 및 랜드마크 그리기
function processVideo() {
	
  	pose.send({image: videoElement});
  	canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
  
  	if(videoElement.paused){
		restartVideo();
		return;
	}
	setTimeout(function() {
			requestAnimationFrame(processVideo);	
	}, 150);

}

function restartVideo(){ // 비디오 중단시, processVideo() 함수 대신 이 함수가 돌아가며 재생을 탐지
	if(!videoElement.paused){
		processVideo();
		return;
	}
	setTimeout(function() {
			restartVideo();
	}, 500);
}

// MediaPipe Pose 결과를 이용하여 랜드마크 그리기
function onPose(results) {
	console.log(results);
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



//videoElement.src = './video/test2.mp4';

