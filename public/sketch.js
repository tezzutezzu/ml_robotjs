const ws = new WebSocket("ws://localhost:40510");
let sending = false;

let video;
let poseNet;
let poses = [];

function setup() {  
  // sendMousePos(200,200)

  createCanvas(window.innerWidth, window.innerHeight);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();  
}

function draw() {
  image(video, 0, 0, 640, 480);

  // We can call both functions to draw all keypoints and the skeletons
  // drawKeypoints();
  // drawSkeleton();

  if (poses.length > 0) {
    let nx = Math.floor(poses[0].pose.nose.x)
    let ny = Math.floor(poses[0].pose.nose.y)

    let fullX = (nx*window.innerWidth)/width
    let fullY = (ny*window.innerHeight)/height
    
    sendMousePos(fullX, fullY)
  }

  noFill()
  stroke(0,0,255)
  strokeWeight(2)
  line(mouseX, mouseY, pmouseX, pmouseY)
}

function sendMousePos(x, y) {
  console.log('asdf')
  // if (!sending) {
    // sending = true;
    ws.send("robot.moveMouseSmooth(" + x + "," + y + ");");
    // setTimeout(() => (sending = false), 1000);
  // }
}

function sendWSMessage(d) {
  if (!sending) {
    sending = true;
    ws.send(d);
    setTimeout(() => (sending = false), 1000);
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

function modelReady() {
  select('#status').html('Model Loaded');
}
