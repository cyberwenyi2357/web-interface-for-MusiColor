//load background image
let img;
let port;
let connectBtn;
let soundAll=[];
let isPlaying = [];
let count=0;
//load icon image
const imagePaths = [
  'icon1.jpg',   // Image path for image 1
  'icon2.jpg',   // Image path for image 2
  'icon3.jpg',   // Image path for image 3
  'icon4.jpg',   // Image path for image 4
  'icon5.jpg',   // Image path for image 5
  'icon6.jpg'    // Image path for image 6
];
let ImagesToBeDisplayed=[];
let newIndex=[];
newIndex[0]=0;
let images = [];
let sound=[];

const gridSize = 200;
const gap = 40;

//icon position
const xStart = 320;
const yStart = 800;

let selectedImageIndex=[]; // Variable to store the index of the selected image
// document.addEventListener("click", MouseClicked);
for (let i = 0; i < 6; i++) {
  selectedImageIndex[i]=-1;
}
function preload() {
  //load background
  img = loadImage('color.jpg');
  //load icon
  for (let i = 0; i < imagePaths.length; i++) {
    const imagePath = imagePaths[i];
    const image = loadImage(imagePath);
    images.push(image);
    soundAll[0] = loadSound("background.mp3");
    soundAll[1] = loadSound("1.mp3");
    soundAll[2] = loadSound("2.mp3");
    soundAll[3] = loadSound("3.mp3");
    soundAll[4] = loadSound("4.mp3");
    soundAll[5] = loadSound("5.mp3");
    soundAll[6] = loadSound("6.mp3");
  }
}
function playMusic(index) {
  if (!soundAll[index].isPlaying()) {
    soundAll[index].play();
  }
}

function setup() {
  createCanvas(img.width , img.height); // Adjust canvas height to accommodate the selected image grid below
  background(200);
  image(img, 0, 0, width, height);
  port = createSerial();
  connectBtn = createButton('Connect to Arduino');
  connectBtn.position(80, 310);
  connectBtn.mousePressed(connectBtnClick);
}

function mouseClicked() {
  console.log("clicked");
  if (
      mouseX > xStart &&
      mouseX < xStart + (gridSize + gap) * 6 &&
      mouseY > yStart &&
      mouseY < yStart + gridSize
  ) {
    // Calculate the index of the clicked image based on the mouse position
    let index = floor((mouseX - xStart) / (gridSize + gap));

    console.log("index of image clicked:", index);
    ImagesToBeDisplayed.push(images[index]);
    // Check if the clicked image is already selected
    for (let i = 0; i < 6; i++) {
      if (selectedImageIndex[i] === index) {
        selectedImageIndex[i] = -1; // Deselect the image if it's clicked again
        // ImagesToBeDisplayed.splice(index, 1);

      } else if (i === index) {
        playMusic(i);
        setTimeout(stopSound, 3000,i);
        selectedImageIndex[i] = index; // Select the clicked image
        newIndex.push(index);
        if(newIndex.length>0){
          print("new index in previous :",newIndex[newIndex.length-1]);
        }else{
          print("kongshuzu");
        }

      }
    }
    for (let i = 0; i < 6; i++) {
      console.log("selectedImageIndex of all images: ");
      console.log(selectedImageIndex[i]);
    }  //
    // }
  }

}
function stopSound(index) {
  soundAll[index].stop(); // 停止音乐的播放
}

function draw() {
  // icon display
  x = xStart;
  for (let i = 0; i < 6; i++) {
    image(images[i], x, height - gridSize, gridSize, gridSize);
    x += gridSize + gap;

  }
  for(let i=0;i<4;i++){
    noStroke();
    if (i === 0) {
      fill(255); // 白色填充
    } else if (i === 1) {
      fill(255, 0, 0); // 红色填充
    } else if (i === 2) {
      fill(0, 255, 0); // 绿色填充
    } else if (i === 3) {
      fill(0, 0, 255); // 蓝色填充
    }
    rect(xStart+ 120+i * 240, height - gridSize - 340, 230,230);
  }


  if(ImagesToBeDisplayed.length!==0){
    for (let i = 0; i < ImagesToBeDisplayed.length; i++) {
      print("number of images to be displayed:",ImagesToBeDisplayed.length);
      image(ImagesToBeDisplayed[i], xStart+ 125+i * 240+(gridSize-230)/4, height - gridSize - 345+(gridSize-230)/2, gridSize, gridSize);

    }
  }

  let str = port.read();
  // changes button label based on connection status
  if (!port.opened()) {
    connectBtn.html('Connect to Arduino');
  } else {
    connectBtn.html('Disconnect');
  }
  if (str.length > 0) {
    // let index = parseInt(str);
    if (!isNaN(str)) {
      let intValue = parseInt(str);
      if (!isNaN(intValue)) {

        text(str, 10, 30);
        console.log("Received data is color:", intValue);
print("new index value:",newIndex[intValue]);
        playMusic(newIndex[intValue]);

      }
    }
  }
}
function connectBtnClick() {
  if (!port.opened()) {
    port.open('Arduino', 9600);
  } else {
    port.close();

  }
}

function sendBtnClick() {
  port.write("Hello from p5.js\n");
}
