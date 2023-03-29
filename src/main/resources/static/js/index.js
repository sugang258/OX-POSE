
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const video_ratio = document.getElementById("video_ratio");
// 사용자 영상 부분
const user_video_box = document.getElementsByClassName('user_video_box')[0];
const user_button_box = document.getElementsByClassName('user_button_box')[0];
const user_input_video = document.getElementById("user_input_video");
const user_video_btn = document.getElementById("user_video_btn");
const user_live_button = document.getElementById("user_live_button");
const user_video_back = document.getElementsByClassName('user_video_back')[0];

// 비교 영상 부분
const compare_video_box = document.getElementsByClassName('compare_video_box')[0];
const compare_button_box = document.getElementsByClassName('compare_button_box')[0];
const compare_video_btn = document.getElementById("compare_video_btn");
const compare_input_video = document.getElementById("compare_input_video");
const compare_video_back = document.getElementsByClassName('compare_video_back')[0];
const compare_canvas = document.getElementsByClassName("compare_canvas")[0];
const compare_canvasCtx = compare_canvas.getContext('2d');

// keyPoint 구분
const leftIndices = [1, 2, 3, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31];
const rightIndices = [4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];
const leftConnections = [
	[11, 13], [13, 15], [15, 21], [15, 17], [15, 19], [17, 19],
	[11, 23], [23, 25], [25, 27], [27, 29], [27, 31], [29, 31]
];
const rightConnections = [
	[12, 14], [14, 16], [16, 22], [16, 18], [16, 20], [18, 20],
	[12, 24], [24, 26], [26, 28], [28, 30], [28, 32], [30, 32]
];
const centerConnections = [
	[11, 12], [23, 24]
];


let camera;
let user_video, compare_video;


// 비디오 크기를 조절하는 함수
video_ratio.addEventListener("change", function() {
	const video = document.getElementsByClassName("video");

	for (let i = 0; i < video.length; i++) {
		video[i].style.height = video[0].videoWidth * video_ratio.value + "px";
	}

});


// 영상 선택 버튼 이벤트
compare_video_btn.addEventListener("click", () => compare_input_video.click());
user_video_btn.addEventListener("click", () => user_input_video.click());

// 파일 입력 이벤트
user_input_video.addEventListener("change",()=> {
	setPlaybackRate(user_input_video,user_video_box ,user_button_box, pose);
});
compare_input_video.addEventListener("change", ()=> {
	setPlaybackRate(compare_input_video,compare_video_box ,compare_button_box, ComparePose);
});


function setPlaybackRate(input_video, video_box, button_box, poseModel) {
	const files = input_video.files;
	
	if (!files || files.length === 0) {
		console.error("No file selected");
		return;
	}

	const file = input_video.files[0];
	const formData = new FormData();
	formData.append('file', file);
	
	
	const options = {
	    method: "POST",
	    body: formData
	};
	
	fetch("changePlaybackRate", options)
	    .then(response => response.text())
	    .then(data => {
				console.log(data);
				const videoElement = createVideoElement(video_box);
				videoElement.pause();
				const videoUrl = URL.createObjectURL(file);
				videoElement.setAttribute("src", videoUrl);
				
				const video = createVideoElement(video_box);
//				video.style.display="none";
				video.src = data.replace('src/main/webapp','');
				video.load();
				prepareAnalyze(video, video_box, button_box, poseModel);
			})
	    .catch(error => console.error(error));
}

/**
	파일 입력시, 분석을 준비하는 함수
 */
function prepareAnalyze(input_video,video_box ,button_box, pose) {
	console.log("prepare");
	video_box.style.display = "block";
	button_box.style.display = "none";

	var canvasCtx = startAnalyze(input_video, canvasElement, pose);
	pose.onResults((results) => responseAnalyze(results, canvasCtx, input_video));
}

/**
	포즈 분석을 시작하는 함수
 */
function startAnalyze(videoElement, canvasElement, poseModel) {
	console.log("start");
	const canvasCtx = canvasElement.getContext('2d');
	
	poseModel.reset();
	videoElement.load();
	
	videoElement.onloadedmetadata = () => {
		canvasElement.width = videoElement.videoWidth;
		canvasElement.height = videoElement.videoHeight;
		console.log("loaded");
		poseModel.initialize().then(() => {
			videoElement.play();
			requestAnalyze(videoElement, canvasCtx, poseModel);
		});
	};
	return canvasCtx;
}

/**
	포즈 분석을 지속적으로 요청하는 함수
 */
function requestAnalyze(videoElement, canvasCtx, poseModel ) {
	
		poseModel.send({ image: videoElement });
//		canvasCtx.drawImage(videoElement, 0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
		console.log("send");
		if (videoElement.paused) { // 비디오 정지시 분석 정지
			videoElement.remove();
			return;
		}
		requestAnimationFrame(() =>
			requestAnalyze(videoElement, canvasCtx, poseModel));
}

const user_result = document.querySelector(".user_result");

/**
	포즈 분석 결과로 스켈레톤을 그리는 함수
 */
function responseAnalyze(results, canvasCtx, videoElement) {
	console.log(results);

	let leftKeyPoint = [];
	let rightKeyPoint = [];
	
	const timestamp = videoElement.currentTime;
	
	if(results.poseWorldLandmarks){
		var jsonData = JSON.stringify({
			poseWorldLandmarks: results.poseWorldLandmarks,
 			timestamp: timestamp,
		});
		$.ajax({
			type: 'POST',
			url: 'setAnalyzePose',
			contentType: 'application/json',
			processData: false,
			dataType: 'json',
			data: jsonData,
			success: function(data) {
				user_result.innerHTML = data; // 각도출력 (임시)
			}
		})
	}

	if (results.poseLandmarks) {
		for (let i = 0; i < results.poseLandmarks.length; i++) {
			if (leftIndices.includes(i)) {
				leftKeyPoint.push(results.poseLandmarks[i]);
			} else {
				rightKeyPoint.push(results.poseLandmarks[i]);
			}
		}
		canvasCtx.save();
		canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
//		canvasCtx.drawImage(results.image, 0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);

		drawLandmarks(canvasCtx, leftKeyPoint, {
			color: '#FF0000', lineWidth: 2
		});
		drawLandmarks(canvasCtx, rightKeyPoint, {
			color: '#0000FF', lineWidth: 2
		});
		drawConnectors(canvasCtx, results.poseLandmarks, leftConnections, {
			color: '#00FFFF', lineWidth: 3
		});
		drawConnectors(canvasCtx, results.poseLandmarks, rightConnections, {
			color: '#00FF00', lineWidth: 3
		});
		drawConnectors(canvasCtx, results.poseLandmarks, centerConnections, {
			color: '#EEEEEE', lineWidth: 3
		});
		canvasCtx.restore();
	}
}



// 비디오 요소를 생성하는 함수
function createVideoElement(video_box) {
	video = document.createElement("video");
	video.className = "video";
	video.setAttribute("controls", "controls");
	video_box.appendChild(video);
	return video;
}

// User live 버튼 클릭 이벤트
user_live_button.addEventListener("click", function() {
	pose.reset();
	user_video = createVideoElement(user_video_box);

	camera = new Camera(user_video, {
		onFrame: async () => {
			await pose.send({ image: user_video });
		},
		width: 1280,
		height: 720
	});

	canvasElement.width = 1280 / 2;
	canvasElement.height = 720 / 2;
	canvasCtx = canvasElement.getContext('2d');
	pose.onResults((results) => responseAnalyze(results, canvasCtx));

	camera.start();
	user_video_box.style.display = "block";
	user_button_box.style.display = "none";
});

// 뒤로가기 버튼
user_video_back.addEventListener("click", function() {
	const video = user_video_box.querySelector('video');
	video.pause();

	if (camera != null) {
		console.log("hi");
		camera.stop();
	}
	video.setAttribute("src", " ");
	user_input_video.value = "";
	user_video_box.style.display = "none";
	user_button_box.style.display = "flex";

	video.remove();
})

compare_video_back.addEventListener("click", function() {
	const video = compare_video_box.querySelector('video');
	video.pause();

	video.setAttribute("src", " ");
	compare_input_video.value = "";
	compare_video_box.style.display = "none";
	compare_button_box.style.display = "flex";

	video.remove();
})


var poseOptions = {
	upperBodyOnly: true,
	modelComplexity: 1,
	smoothLandmarks: true,
	enableSegmentation: false,
	minDetectionConfidence: 0.5,
	minTrackingConfidence: 0.5,
	maxNumDetection: 3
}

var pose = new Pose({
	locateFile: (file) => {
		return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
	}
});

var ComparePose = new Pose({
	locateFile: (file) => {
		return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
	}
});

pose.setOptions(poseOptions);
ComparePose.setOptions(poseOptions);


