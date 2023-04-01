<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>OX-POSE</title>
<!-- <link href="/css/index.css" rel="stylesheet"> -->

<style type="text/css">
.body_section {
	display: flex;
	justify-content: center;
	max-height: 80%;
	min-height: 300px;
	width: 100%;
}

.container {
	display: inline-flex;
	justify-content: space-around;
	width: 80%;
	height: 80%;
}

.video_box {
	margin: 0 3%;
	height: 100%;
	width: 100%;
}

.video {
	margin: 0 auto;
	width: 90%;
	aspect-ratio: 9/16;
}

.user_button_box, .compare_button_box {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
}

.user_video_box, .compare_video_box {
	display: none;
}

#user_input_video, #compare_input_video {
	display: none;
}

.modal {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: none;
	background-color: rgba(0, 0, 0, 0.4);
}

.modal.show-modal {
	display: block;
}

.modal_background.show-modal {
	display: block;
}

.modal_body {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 400px;
	height: 600px;
	padding: 40px;
	z-index: 2;
	text-align: center;
	background-color: rgb(255, 255, 255);
	border-radius: 10px;
	box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
	transform: translateX(-50%) translateY(-50%);
	overflow: scroll;
}

.modal_background {
	position: absolute;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	top: 0;
	left: 0;
	z-index: 1;
	display: none;
}

.modal_close {
	width: 26px;
	height: 26px;
	position: absolute;
	top: 10px;
	right: 10px;
}

.modal_video_box {
	height: 20%;
	background-color: aqua;
	display: flex;
	margin: 2%;
}

.modal_video_thum {
	background-color: black;
	width: 40%;
	margin: 2%;
}

.modal_video_info {
	margin: 2%;
}

/* 3D grid */

 .landmark-grid-container {
      height: 100%;
      width: 100%;
      top:0;
      left:0;
      background-color: #99999999;
    }
    .square-box {
      width: 400px;
      height: 400px;
     
    }
    
    


</style>

<!-- media pipe -->
<script
	src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
	crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils_3d/control_utils_3d.js" crossorigin="anonymous"></script>
<script
	src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"
	crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js"
	crossorigin="anonymous"></script>

</head>
<body>
	<h1>OX POSE</h1>
	<div>
		<h3>(( TEST LINK ))</h3>
		<a href="./live"> 실시간 영상 test</a> <a href="./pose"> video 영상 test</a>
		<a href="./multi"> tensorFlow 이미지 test</a> <a href="./multiVideo">tensorFlow
			영상 test</a>
	</div>

	<div>
		<input id="video_ratio" type="range" min="0.5" max="1.6" step="any">
		<label for="video_ratio">영상 비율</label>
	</div>


	<hr>
	<section class="body_section">
		<div class="container">

			<div class="video_box compare_box">
				<div class="compare_button_box">
					<button id="compare_video_btn">비교 영상 직접 선택</button>
					<input id="compare_input_video" class="input_video" type="file"
						accept="video/mp4,video/mkv,video/x-m4,video/*">
					<button class="modal_btn">샘플 영상 선택</button>
				</div>
				<div class="compare_video_box">
					<!-- 					<video class="video compare_video" src="./video/test4.mp4" controls></video> -->
					<button class="compare_video_back">뒤로가기</button>
					<!-- 사용자 영상 Video 태그 부분 -->
				</div>

			</div>
			<div class="video_box user_box">
				<div class="user_button_box">
					<button id="user_live_button">실시간</button>
					<button id="user_video_btn">영상 선택</button>
					<input id="user_input_video" class="input_video" type="file"
						accept="video/mp4,video/mkv,video/x-m4,video/*">
				</div>
				<div class="user_video_box">
					<button class="user_video_back">뒤로가기</button>
					<!-- 사용자 영상 Video 태그 부분 -->
				</div>

			</div>
		</div>
	</section>



	<hr>
	<div id="canvas_box">
		<div>
			<h3 class="compare_result"></h3>
			<canvas class="compare_canvas"></canvas>
		</div>
		<div style="display: inline-flex;">
			<div>
			<h3 class="user_result"></h3>
			<canvas class="output_canvas"></canvas>
			</div>
			<div class='square-box'>
			    <div class="landmark-grid-container">
			    </div>
			</div>
		
		</div>
		

	</div>
	


	<div class="modal_background"></div>
	<div class="modal">
		<div class="modal_body">
			<div class="modal_close">X</div>
			<div>샘플 영상 선택</div>
			<hr>
			<div class="modal_video_box">
				<div class="modal_video_thum"></div>
				<div class="modal_video_info">
					<div class="modal_video_title">title</div>
					<div class="modal_video_contents">contents</div>
				</div>
			</div>

		</div>
	</div>


	<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
	<script type="text/javascript" src="/js/index.js"></script>
	<script>
      const modal = document.querySelector('.modal');
      const modal_background = document.querySelector('.modal_background')
      const modal_body = document.querySelector(".modal_body");
      
      document.querySelector('.modal_btn').addEventListener('click', () => {
    	  open();
      });
    	//Hide modal
     document.querySelector('.modal_close').addEventListener('click', () => {
 		 close();
		})
  
      //Hide modal
      window.addEventListener('click', (e) => {
      	e.target === modal_background ?  close() : false;
      })
      
      function close(){
   	  	modal.classList.remove('show-modal');
        modal_background.classList.remove('show-modal');
        document.body.style.overflow = 'auto';
       };
	  function open(){
			
  		modal.classList.add('show-modal');
        modal_background.classList.add('show-modal');
        document.body.style.overflow = 'hidden';
       };
	  
		
       
		
//     	   var div = document.createElement("div");
//     	   var div2 = document.createElement("div");
//     	   var div3 = document.createElement("div");
//     	   var div4 = document.createElement("div");
//     	   var div5 = document.createElement("div");

    	   
			
//     	   div.className = "modal_video_box";
//     	   div2.className = "modal_video_thum";
//     	   div3.className = "modal_video_info";
//     	   div4.className = "modal_video_title";
//     	   div4.innerHTML = "1";
    	   
//     	   div5.className = "modal_video_contents";

//     	   modal_body.append(div);
//     	   div.append(div2);
//     	   div.append(div3);
//     	   div3.append(div4);
//     	   div3.append(div5);
    	   

       
       
	 
	</script>
</body>
</html>