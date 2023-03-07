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
  	<img id = "img"  src="./image/grade.jpg" width="600px" style="position: absolute; top : 0; left : 0;">
    <video id="input_video"></video>
    <canvas id="output_canvas" width="600px" height="800px" style="position: absolute; top : 0; left : 0;"></canvas>
  </div>
  
 <!-- Load TensorFlow.js. This is required to use coco-ssd model. -->
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"> </script>
<!-- Load the coco-ssd model. -->
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd"> </script>

<!-- Place your code in the script tag below. You can also use an external .js file -->
<script type="text/javascript">
  // Notice there is no 'import' statement. 'cocoSsd' and 'tf' is
  // available on the index-page because of the script tag above.

  const img = document.getElementById('img');
  const canvas = document.getElementById('output_canvas');
  const ctx = canvas.getContext('2d');
  // Load the model.
  cocoSsd.load().then(model => {
    // detect objects in the image.
    model.detect(img).then(predictions => {
      console.log('Predictions: ', predictions);
      predictions.forEach(prediction => {
  	    ctx.beginPath();
  	    ctx.rect(...prediction.bbox);
  	    ctx.lineWidth = 3;
  	    ctx.strokeStyle = 'lime';
  	    ctx.fillStyle = 'lime';
  	    ctx.stroke();
  	    ctx.fillText(prediction.class, prediction.bbox[0], prediction.bbox[1] - 5);
  	  });
    });
  });
  

//   const video = document.getElementById('input_video');
  
//   navigator.mediaDevices.getUserMedia({ video: true })
//   .then((stream) => {
//     video.srcObject = stream;
//     video.onloadedmetadata = () => {
//       video.play();
//       detectFrame();
//     }
//   });
  
 
  
//   async function detectFrame() {
// 	  const model = await cocoSsd.load();
// 	  const predictions = await model.detect(video);

// 	  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
// 	  ctx.drawImage(video, 0, 0);
// 	  predictions.forEach(prediction => {
// 	    ctx.beginPath();
// 	    ctx.rect(...prediction.bbox);
// 	    ctx.lineWidth = 3;
// 	    ctx.strokeStyle = 'green';
// 	    ctx.fillStyle = 'green';
// 	    ctx.stroke();
// 	    ctx.fillText(prediction.class, prediction.bbox[0], prediction.bbox[1] - 5);
// 	  });

// 	  requestAnimationFrame(detectFrame );
// 	}
</script>
</body>
</html>