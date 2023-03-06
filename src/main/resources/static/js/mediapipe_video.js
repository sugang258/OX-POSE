const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
const grid = new LandmarkGrid(landmarkContainer);

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
		upperBodyOnly: true,
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

videoElement.addEventListener("playing", processVideo); // 비디오 재생시 분석 시작
// 비디오 프레임 처리 및 랜드마크 그리기
function processVideo() {

	pose.send({ image: videoElement });
	canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

	if (videoElement.paused) { // 비디오 정지시 분석 정지
		return;
	}

	setTimeout(function() {
		requestAnimationFrame(processVideo);
	}, 150);
}

const leftIndices = [1, 2, 3, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31];
const rightIndices = [4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];

// MediaPipe Pose 결과를 이용하여 랜드마크 그리기
function onPose(results) {
	if (!results.poseLandmarks) {
		grid.updateLandmarks([]);
		return;
	}

	const keyPoint = results.poseLandmarks;
	let leftKeyPoint = [];
	let rightKeyPoint = [];
	if (keyPoint != null) {

		canvasCtx.save();
		canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
		canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
		//canvasCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';

		for (let i = 0; i < keyPoint.length; i++) {
			if (leftIndices.includes(i)) {
				leftKeyPoint.push(keyPoint[i]);
			} else {
				rightKeyPoint.push(keyPoint[i]);
			}
		}

		drawLandmarks(canvasCtx, leftKeyPoint, {
			color: '#FF0000', lineWidth: 3
		});
		drawLandmarks(canvasCtx, rightKeyPoint, {
			color: '#0000FF', lineWidth: 3
		});
		drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
			{
				color: '#00FF00', lineWidth: 3
			});

		//	drawLandmarks(results.poseLandmarks);

		canvasCtx.restore();
		grid.updateLandmarks(results.poseWorldLandmarks);

	}
}
