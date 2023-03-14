<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>OX-POSE</title>
<!-- <link href="/css/index.css" rel="stylesheet"> -->

<style type="text/css">
.body_section{
	display: flex;
	justify-content: center;
	max-height: 80%;
	width: 100%;
}

.container {
	display: inline-flex;
	justify-content : space-around;
	
	width : 80%;
	height: 80%;
}

.video_box {
	margin : 0 3%;
	width : 100%;
}

.video {
	margin : 0 auto;
	width: 90%;
	aspect-ratio: 9/16;
	}
.user_button{
	display : flex;
	justify-content : center;
	align-items : center;
	width: 100%;
	height: 100%;
	
/* 	display: none; */
}
.user_video{
	display: none;
}
#input_video_button{
	display: none;
}
	
	
}
</style>

 	<script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils_3d/control_utils_3d.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" crossorigin="anonymous"></script>

</head>
<body>
	<h1>OX POSE</h1>
	<div>
		<h3>(( TEST LINK ))</h3>
		<a href="./live"> 실시간 영상 test</a> 
		<a href="./pose"> video 영상 test</a>
		<a href="./multi"> tensorFlow 이미지 test</a> 
		<a href="./multiVideo">tensorFlow 영상 test</a>
	</div>

	<hr>
	<section class = "body_section" >
		<div class="container">
			
			<div class="video_box compare_video_box">
				<div>
					<button>비교 영상 직접 선택</button>
					<button>샘플 영상 선택</button>
				</div>
				<video class="video compare_video" src="./video/test4.mp4" controls></video>
			</div>
			<div class="video_box user_video_box">
				<div class="user_button">
					<button id = "live_button">실시간</button>
					<button id = "video_button">영상 선택</button>
					<input id="input_video_button" type="file" accept="video/mp4,video/mkv,video/x-m4,video/*">
				</div>
				
				<video class="video user_video" src="./video/test4.mp4" controls></video>
			</div>
		</div>
	</section>

	<hr>
	<canvas class="output_canvas"></canvas>


 	<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
	<script type="text/javascript" src="/js/index.js"></script>
</body>
</html>