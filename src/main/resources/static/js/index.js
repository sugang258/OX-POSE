
var user_video = document.getElementsByClassName('user_video')[0];
const user_video_box = document.getElementsByClassName('user_video_box')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const user_button_box = document.getElementsByClassName('user_button_box')[0];
const input_video_button = document.getElementById("input_video_button");
const video_button = document.getElementById("video_button");
const live_button = document.getElementById("live_button");
const user_video_back = document.getElementsByClassName('user_video_back')[0];

// 비디오 버튼 클릭 이벤트
video_button.addEventListener("click", function() {
	input_video_button.click();
});

// 파일 입력시 이벤트
input_video_button.addEventListener("change", function() {
	const file = input_video_button.files[0];
	const videoUrl = URL.createObjectURL(file);
	user_video.pause();
	user_video.setAttribute("src", videoUrl);
	user_video_box.style.display = "block";
	user_button_box.style.display = "none";
	poseStart();
});

// 실시간 버튼 클릭 이벤트
live_button.addEventListener("click", function(){
	const camera = new Camera(user_video, {
		onFrame: async () => {
			await pose.send({ image: user_video });
		},
		width: 1280,
		height: 720
	});
	camera.start();
	
	user_video_box.style.display = "block";
	user_button_box.style.display = "none";
	
});

// 뒤로가기 버튼
user_video_back.addEventListener("click",function(){
	user_video.pause();
	user_video.setAttribute("src", " ");
	input_video_button.value = "";
	user_video_box.style.display = "none";
	user_button_box.style.display = "flex";
})


// pose 모델 load
var pose = new Pose({
	locateFile: (file) => {
		return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
	}
});
pose.setOptions({
		upperBodyOnly: true,
		modelComplexity: 1,
		smoothLandmarks: true,
		enableSegmentation: false,
		minDetectionConfidence: 0.5,
		minTrackingConfidence: 0.5
});
pose.onResults(onPose);


//mediapipe pose 모델 초기화, 세팅 후 시작
function poseStart() {
	user_video.addEventListener("playing", processVideo);
	user_video.load();

	// 비디오 재생 후, 프레임 처리 시작
	user_video.onloadedmetadata = () => {
		canvasElement.width = user_video.videoWidth;
		canvasElement.height = user_video.videoHeight;
		
		processVideo();
	};
}

// 비디오 프레임 처리 및 랜드마크 그리기
function processVideo() {
	pose.send({ image: user_video });
	canvasCtx.drawImage(user_video, 0, 0, canvasElement.width, canvasElement.height);
	
	if (user_video.paused) { // 비디오 정지시 분석 정지
		return;
	}

	requestAnimationFrame(processVideo,customConfig);
}

const customConfig = {
	  maxFPS: 30,
	  skipFrames: 2
};

const leftIndices = [1, 2, 3, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31];
const rightIndices = [4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];
const leftConnections = [
  [11,13],[13,15],[15,21],[15,17],[15,19],[17,19],
  [11,23],[23,25],[25,27],[27,29],[27,31],[29,31]
];
const rightConnections = [
  [12,14],[14,16],[16,22],[16,18],[16,20],[18,20],
  [12,24],[24,26],[26,28],[28,30],[28,32],[30,32]
];
const centerConnections = [
  [11,12],[23,24]
];


// MediaPipe Pose 결과를 이용하여 랜드마크 그리기
function onPose(results) {
	console.log(results);
	
	const keyPoint = results.poseLandmarks;
	let leftKeyPoint = [];
	let rightKeyPoint = [];
	if (keyPoint != null) {

		canvasCtx.save();
		canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
		canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
		
		for (let i = 0; i < keyPoint.length; i++) {
			if (leftIndices.includes(i)) {
				leftKeyPoint.push(keyPoint[i]);
			} else {
				rightKeyPoint.push(keyPoint[i]);
			}
		}

		drawLandmarks(canvasCtx, leftKeyPoint, {
			color: '#FF0000', lineWidth: 2
		});
		drawLandmarks(canvasCtx, rightKeyPoint, {
			color: '#0000FF', lineWidth: 2
		});
		drawConnectors(canvasCtx, keyPoint, leftConnections,
			{
				color: '#00FFFF', lineWidth: 3
			});
		drawConnectors(canvasCtx, keyPoint, rightConnections,
			{
				color: '#00FF00', lineWidth: 3
			});
		drawConnectors(canvasCtx, keyPoint, centerConnections,
		{
			color: '#EEEEEE', lineWidth: 3
		});

		canvasCtx.restore();
	}
}
