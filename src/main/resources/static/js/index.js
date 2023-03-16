



const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');


const user_video_box = document.getElementsByClassName('user_video_box')[0];
const user_button_box = document.getElementsByClassName('user_button_box')[0];
const user_input_video = document.getElementById("user_input_video");
const user_video_btn = document.getElementById("user_video_btn");
const live_button = document.getElementById("live_button");
const user_video_back = document.getElementsByClassName('user_video_back')[0];

// 비교 영상 부분
const compare_video_box = document.getElementsByClassName('compare_video_box')[0];
const compare_button_box = document.getElementsByClassName('compare_button_box')[0];
const compare_video_btn = document.getElementById("compare_video_btn");
const compare_input_video = document.getElementById("compare_input_video");
const compare_video_back = document.getElementsByClassName('compare_video_back')[0];

const compare_canvas = document.getElementsByClassName("compare_canvas")[0];
const compare_canvasCtx = compare_canvas.getContext('2d');


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



let camera;
let user_video,compare_video;



compare_video_btn.addEventListener("click", function() {
	compare_input_video.click();
});





// 비디오 버튼 클릭 이벤트
user_video_btn.addEventListener("click", function() {
	user_input_video.click();
});


compare_input_video.addEventListener("change", function() {
	const file = compare_input_video.files[0];
	const videoUrl = URL.createObjectURL(file);
	
	compare_video = createVideoElement(compare_video_box);
	
	compare_video.pause();
	compare_video.setAttribute("src", videoUrl);
	compare_video_box.style.display = "block";
	compare_button_box.style.display = "none";
	
	ComparePoseStart();
	ComparePose.onResults(onComparePose);
});


// User 파일 입력시 이벤트
user_input_video.addEventListener("change", function() {
	const file = user_input_video.files[0];
	const videoUrl = URL.createObjectURL(file);
	
	user_video = createVideoElement(user_video_box);
	
	user_video.pause();
	user_video.setAttribute("src", videoUrl);
	user_video_box.style.display = "block";
	user_button_box.style.display = "none";
	
	poseStart();
	pose.onResults(onPose);
});


function createVideoElement(video_box){
	video = document.createElement("video");
	video.className = "video";
	video.setAttribute("controls","controls");
	video_box.appendChild(video);
	return video;
}

// User 실시간 버튼 클릭 이벤트
live_button.addEventListener("click", function(){
	pose.reset();
	user_video = createVideoElement(user_video_box);
	
	camera = new Camera(user_video, {
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
	
	
	if(camera != null){
		console.log("hi");
		camera.stop();
	}
	user_video.setAttribute("src", " ");
	user_input_video.value = "";
	user_video_box.style.display = "none";
	user_button_box.style.display = "flex";
	
	user_video.remove();
})

compare_video_back.addEventListener("click",function(){
	compare_video.pause();
	
	compare_video.setAttribute("src", " ");
	compare_input_video.value = "";
	compare_video_box.style.display = "none";
	compare_button_box.style.display = "flex";
	
	compare_video.remove();
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
		minTrackingConfidence: 0.5,
		maxNumDetection : 3
});

//비교영상 pose 모델 load
var ComparePose = new Pose({
	locateFile: (file) => {
		return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
	}
});
ComparePose.setOptions({
		upperBodyOnly: true,
		modelComplexity: 1,
		smoothLandmarks: true,
		enableSegmentation: false,
		minDetectionConfidence: 0.5,
		minTrackingConfidence: 0.5,
		maxNumDetection : 3
});

//mediapipe pose 모델 초기화, 세팅 후 시작
function poseStart() {
	pose.reset();
	user_video.load();
	user_video.addEventListener("playing", processVideo);
	// 비디오 재생 후, 프레임 처리 시작
	user_video.onloadedmetadata = () => {
		canvasElement.width = user_video.videoWidth;
		canvasElement.height = user_video.videoHeight;
		
		processVideo();
	};
}

//비교영상 mediapipe pose 모델 초기화, 세팅 후 시작
function ComparePoseStart() {
	ComparePose.reset();
	compare_video.load();
	compare_video.addEventListener("playing", processCompareVideo);

	compare_video.onloadedmetadata = () => {
		compare_canvas.width = compare_video.videoWidth;
		compare_canvas.height = compare_video.videoHeight;

		processCompareVideo();
	}
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

// 비교 영상 비디오 프레임 처리 및 랜드마크 그리기
function processCompareVideo() {
	ComparePose.send({image : compare_video });
	compare_canvasCtx.drawImage(compare_video, 0, 0, compare_canvas.width, compare_canvas.height);

	if(compare_video.paused) {
		return;
	}
	requestAnimationFrame(processCompareVideo, customConfig);
}

const customConfig = {
	  maxFPS: 30,
	  skipFrames: 2
};




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

// MediaPipe Pose 결과를 이용하여 랜드마크 그리기
function onComparePose(results) {
	console.log(results);
	
	const keyPoint = results.poseLandmarks;

	var jsonData = JSON.stringify(keyPoint);

	console.log(jsonData);

	$.ajax({
		type :'POST',
		url :'ComparePosePrint',
		contentType:'application/json',
		processData : false,
		dataType : 'json',
		data : jsonData,
		success : function(data) {
			console.log('전송완료');
		}
	})

	let leftKeyPoint = [];
	let rightKeyPoint = [];
	if (keyPoint != null) {

		compare_canvasCtx.save();
		compare_canvasCtx.clearRect(0, 0, compare_canvas.width, compare_canvas.height);
		compare_canvasCtx.drawImage(results.image, 0, 0, compare_canvas.width, compare_canvas.height);
		
		for (let i = 0; i < keyPoint.length; i++) {
			if (leftIndices.includes(i)) {
				leftKeyPoint.push(keyPoint[i]);
			} else {
				rightKeyPoint.push(keyPoint[i]);
			}
		}

		drawLandmarks(compare_canvasCtx, leftKeyPoint, {
			color: '#FF0000', lineWidth: 2
		});
		drawLandmarks(compare_canvasCtx, rightKeyPoint, {
			color: '#0000FF', lineWidth: 2
		});
		drawConnectors(compare_canvasCtx, keyPoint, leftConnections,
			{
				color: '#00FFFF', lineWidth: 3
			});
		drawConnectors(compare_canvasCtx, keyPoint, rightConnections,
			{
				color: '#00FF00', lineWidth: 3
			});
		drawConnectors(compare_canvasCtx, keyPoint, centerConnections,
		{
			color: '#EEEEEE', lineWidth: 3
		});

		compare_canvasCtx.restore();
	}
}

