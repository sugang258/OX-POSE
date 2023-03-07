<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Insert title here</title>
    <meta charset="UTF-8">
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils_3d/control_utils_3d.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" crossorigin="anonymous"></script>
</head>
<body>
	<select id="chooseVideo">
		<option value="./video/test2.mp4" >인라인영상(1인)</option>
	    <option value="./video/test4.mp4" selected="selected">스키 영상(1인)</option>
	    <option value="./video/test1.mp4">졸업식영상(3인)</option>
	</select>

    <input id="file" type="file" accept="video/mp4,video/mkv,video/x-m4,video/*">	
	

    <div class="container">
		<video src="./video/test4.mp4" class="input_video" width="1280px" height="720px" controls>
            
        </video> 
		<canvas class="output_canvas" width="1280px" height="720px"></canvas>
		<div class="landmark-grid-container"></div>
	</div> 
	
	 <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
    <script type="text/javascript" src="./js/mediapipe_video.js"></script>
    
    
    
    
</body>
</html>