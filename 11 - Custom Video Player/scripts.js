// Get Our elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullscreen = player.querySelector('#fullscreen');

// Build out functions
function togglePlay(){
  if (video.paused) {
    video.play();
  }else {
    video.pause();
  }
}

function updateButton(){
  const icon = this.paused ? '►' : '❚❚';
  toggle.textContent = icon;
  console.log("Update the button");
}

function skip(){
  console.log(this.dataset.skip);
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate(){
  video[this.name] = this.value;
  console.log(this.name);
  console.log(this.value);
}

function handleProgress(){
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e){
  console.log(e);
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

function fullScreened(){
  console.log(this);
  fs = !fs;
  console.log(fs);
  if (fs) {
    video.classList.add('fullscreen');
  }else {
    video.classList.remove('fullscreen');
  }
}

function escape(e){
  if (fs && e.key === "Escape") {
    console.log(e.key);
    fs = !fs;
    video.classList.remove('fullscreen');
  }
}

//Hook up event listeners
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

let fs = false;
fullscreen.addEventListener('click',fullScreened);
window.addEventListener('keydown',escape);


toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener("click",skip));
ranges.forEach(range => range.addEventListener('change',handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove',handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click',scrub);
progress.addEventListener('mousemove',(e)=> mousedown && scrub(e));
progress.addEventListener('mousedown',()=> mousedown = true);
progress.addEventListener('mouseup',()=> mousedown = false);
