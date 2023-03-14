const canvas = document.getElementById('output_canvas');
const ctx = canvas.getContext('2d');
const video = document.getElementById('input_video');


const videoWidth = video.videoWidth;
const videoHeight = video.videoHeight;
canvas.width = videoWidth;
canvas.height = videoHeight;

//   navigator.mediaDevices.getUserMedia({ video: true })
//   .then((stream) => {
//     video.srcObject = stream;
//     video.onloadedmetadata = () => {
//       video.play();
//       detectFrame();
//     }
//   });

//   video.onloadedmetadata = () => {
// //       video.play();
//     setInterval(() => {
//         ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
//         detectPoseInFrame(canvas);
//     }, 16);
// };



video.addEventListener("playing", detectPoseInFrame);

posenet.load().then((model) => {
    video.onloadeddata = (e) => {
        detectPoseInFrame()
    }
})
async function detectFrame() {
//     const model = await cocoSsd.load();
//     const predictions = await model.detect(video);
    
//     const ratio = Math.min(video.width/video.videoWidth ,video.height/video.videoHeight );
    
    
    // canvas.width = video.videoWidth * ratio ;
    // canvas.height = video.videoHeight * ratio;
    // canvas.style.top = (video.height- canvas.height)/2 + 'px';
    // canvas.style.left = (video.width- canvas.width)/2 + 'px';
    
//     console.log(video.width+ " /" + canvas.width + "/" + (video.width - canvas.width));
//     ctx.clearRect(0 , 0, video.width, video.height);
// // 	  ctx.drawImage(video, 0, 0 , canvas.width, canvas.height);
    
    
//     predictions.forEach(prediction => {
//       console.log('Predictions: ', prediction);
      
//       var scaledBbox = prediction.bbox.map((val) => val * ratio );
      
      
//       ctx.beginPath();
//       ctx.rect(...scaledBbox);
//       ctx.lineWidth = 3;
//       ctx.strokeStyle = 'lime';
//       ctx.fillStyle = 'lime';
//       ctx.stroke();
//       ctx.fillText(prediction.class, scaledBbox[0], scaledBbox[1] - 5);
//     });
    
    if(!video.paused){
        requestAnimationFrame(detectFrame);
    }


  }

  async function detectPoseInFrame(frame) {

    const model = await posenet.load();

    const boundingBoxes = await model.estimateMultiplePoses(
        frame,
        {flipHorizontal:false}
    );

    for(let i=0; i<boundingBoxes.length;i++) {
        const bbox = boundingBoxes[i].bbox;
        const x = bbox[0];
        const y = bbox[1];
        const width = bbox[2];
        const height = bbox[3];

        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');
        croppedCanvas.width = width;
        croppedCanvas.height = height;
        croppedCtx.drawImage(frame, x,y, width, height,0,0,width,height);

        const croppedImage = croppedCanvas.toDataURL('image/jpeg');
        const pose = await runPoseDectionOnImage(croppedImage);

        if(pose) {
            const adjustedKeypoints = pose.keypoints.map((keypoint)=> {
                return{
                    ...keypoint,
                    position:{
                        x : keypoint.position.x+x,
                        y:keypoint.position.y+y,
                    },
                };
            });

            drawKeypoints(adjustedKeypoints,0.5,ctx);
        }
        if(!video.paused){
            requestAnimationFrame(dectPoseInFrame);
        }

    }
  }

  video.onloadedmetadata = () => {
//       video.play();
    setInterval(() => {
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
        detectPoseInFrame(canvas);
    }, 16);
};


//tensorflow에서 제공하는 js 파트
const color = "aqua";
const boundingBoxColor = "red";
const lineWidth = 2;

function toTuple({y, x}) {
    return [y, x];
}

function drawPoint(ctx, y, x, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
    ctx.beginPath();
    ctx.moveTo(ax * scale, ay * scale);
    ctx.lineTo(bx * scale, by * scale);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(keypoints, minConfidence);

    adjacentKeyPoints.forEach((keypoints) => {
        drawSegment(toTuple(keypoints[0].position), toTuple(keypoints[1].position), color, scale, ctx);
    });
}

function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
    for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];

        if (keypoint.score < minConfidence) {
            continue;
        }

        const {y, x} = keypoint.position;
        drawPoint(ctx, y * scale, x * scale, 3, color);
    }
}

function drawBoundingBox(keypoints, ctx) {
    const boundingBox = posenet.getBoundingBox(keypoints);

    ctx.rect(
        boundingBox.minX,
        boundingBox.minY,
        boundingBox.maxX - boundingBox.minX,
        boundingBox.maxY - boundingBox.minY
    );

    ctx.strokeStyle = boundingBoxColor;
    ctx.stroke();
}