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
    <div class="container">
		<video src="./video/test2.mp4" class="input_video" width="1280px" height="720px" controls>
            
        </video> 
		<canvas class="output_canvas" width="1280px" height="720px"></canvas>
		<div class="landmark-grid-container"></div>
	</div> 
	
    <script type="text/javascript" src="./js/mediapipe_video.js"></script>
</body>
</html>