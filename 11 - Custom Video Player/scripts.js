const progress = document.querySelector('.progress');
const progFilled = document.querySelector('.progress__filled');
progFilled.style['flex-basis'] = `0%`;

const video = document.querySelector('.viewer');
const play = document.querySelector('.toggle');
const playBtns = document.querySelectorAll('.player__button');
const rangeSliders = document.querySelectorAll('.player__slider');

const togglePlayBtn = () => {
  play.innerText = (video.paused) ? '►' : '||';
};

const togglePlay = (e) => {
  const { target } = e;
  if (target.dataset.skip) {
    const change = Number(target.dataset.skip);
    video.currentTime += change;
    video.play();
    return;
  }

  const action = (video.paused) ? 'play' : 'pause';
  video[action]();
};

const changePlace = () => {
  const percent = video.currentTime / video.duration;
  progFilled.style.flexBasis = `${percent * 100}%`;
};

const movePlaceWithClick = (e) => {
  video.currentTime =  (e.offsetX / progress.offsetWidth) * video.duration;
  video.play();
}

const changeRange = (e) => {
  const { target } = e;
  const { value, name } = target;
  const type = (name === 'volume') ? 'volume' : 'playbackRate';
  video[type] = Number(value);
};

// Video listeners
video.addEventListener('click', togglePlay);
video.addEventListener('play', togglePlayBtn);
video.addEventListener('pause', togglePlayBtn);
video.addEventListener('timeupdate', changePlace);

// Changes on controls
playBtns.forEach(btn => btn.addEventListener('click', togglePlay));
rangeSliders.forEach(range => range.addEventListener('input', changeRange));

// Changes on progress bar
progress.addEventListener('click', movePlaceWithClick);

let mousedown = false;
progress.addEventListener('mousemove', (e) => mousedown && movePlaceWithClick(e));
progress.addEventListener('mouseup', () => mousedown = false);
progress.addEventListener('mousedown', () => mousedown = true);

