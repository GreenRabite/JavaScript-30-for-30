const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo(){
  navigator.mediaDevices.getUserMedia({ video: true, audio: false})
  .then(localMediaStream=>{
    console.log(localMediaStream);
    video.src = window.URL.createObjectURL(localMediaStream);
    video.play();
  })
  .catch(err => {
    console.error("Oh No!!",err);
  });
}

function paintToCanvas(){
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  //Every 16ms, take a picture
  return setInterval(()=>{
    ctx.drawImage(video, 0, 0, width, height);
    //Take pixels out
    let pixels = ctx.getImageData(0,0,width,height);
    // Mess with the pixels
    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    // ctx.gobalAlpha = 0.05;
    pixels = greenScreen(pixels);
    // put the pixels back
    ctx.putImageData(pixels,0,0);
  },16);
}

function takePhoto(){
  //Sound from taking a photo
  snap.currentTime = 0;
  snap.play();

  //take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download','handsome');
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
  link.getContext = 'Download Image';
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels){
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i+0] + 100; //red
    pixels.data[i + 1] = pixels.data[i+1] - 50; //green
    pixels.data[i + 2] = pixels.data[i+2] * 0.5; //blue
  }

  return pixels;
}

function rgbSplit(pixels){
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i+0]; //red
    pixels.data[i + 500] = pixels.data[i+1]; //green
    pixels.data[i - 550] = pixels.data[i+2]; //blue
  }

  return pixels;
}

function greenScreen(pixels){
  const levels = {};
  document.querySelectorAll('.rgb input').forEach(input => {
    levels[input.name] = input.value;
  });
  for (let i = 0; i < pixels.data.length; i += 4) {
    let red = pixels.data[i+0]; //red
    let green = pixels.data[i+1]; //green
    let blue = pixels.data[i+2]; //blue
    let alpha = pixels.data[i+3]; //blue
    
    if (red > levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i+3] = 0;
    }
  }
  return pixels;
}


getVideo();

video.addEventListener('canplay',paintToCanvas);
