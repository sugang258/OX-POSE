<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils_3d/control_utils_3d.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/objectron/objectron.js" crossorigin="anonymous"></script>


</head>

<body>
  <div class="container">
    <video id="input_video" src="./video/test1.mp4" width="500" height="500" 
    	style="object-fit: contain ;" controls></video>
    <canvas id="output_canvas" style="position: absolute; "></canvas>
  </div>
  
 <!-- Load TensorFlow.js. This is required to use coco-ssd model. -->
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"> </script>
<!-- Load the coco-ssd model. -->
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd"> </script>

<!-- Place your code in the script tag below. You can also use an external .js file -->
<script type="text/javascript">
  const canvas = document.getElementById('output_canvas');
  const ctx = canvas.getContext('2d');
  const video = document.getElementById('input_video');
  
//   navigator.mediaDevices.getUserMedia({ video: true })
//   .then((stream) => {
//     video.srcObject = stream;
//     video.onloadedmetadata = () => {
//       video.play();
//       detectFrame();
//     }
//   });
  
    video.onloadedmetadata = () => {
//       video.play();
      detectFrame();
    };
 
  video.addEventListener("playing", detectFrame);
  async function detectFrame() {
	  const model = await cocoSsd.load();
	  const predictions = await model.detect(video);
	  
	  const ratio = Math.min(video.width/video.videoWidth ,video.height/video.videoHeight );
	  
	  
	  
	  canvas.width = video.videoWidth * ratio ;
	  canvas.height = video.videoHeight * ratio;
	  canvas.style.top = (video.height- canvas.height)/2 + 'px';
	  canvas.style.left = (video.width- canvas.width)/2 + 'px';
	  
	  ctx.clearRect(0 , 0, video.width, video.height);
// 	  ctx.drawImage(video, 0, 0 , canvas.width, canvas.height);
	  
	  predictions.forEach(prediction => {
		console.log('Predictions: ', prediction);
		
		var scaledBbox = prediction.bbox.map((val) => val * ratio );
		
	    ctx.beginPath();
	    ctx.rect(...scaledBbox);
	    ctx.lineWidth = 3;
	    ctx.strokeStyle = 'lime';
	    ctx.fillStyle = 'lime';
	    ctx.stroke();
	    ctx.fillText(prediction.class, scaledBbox[0], scaledBbox[1] - 5);
	  });
	  
	  if(!video.paused){
		  requestAnimationFrame(detectFrame);
	  }
	}
</script>
</body>
</html>