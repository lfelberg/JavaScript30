const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const ranges = document.querySelectorAll('input');

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(err => console.error('OH NO!!', err));
}


const redEffect = (pixels) => {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] -= 100;
    pixels.data[i + 1] -= 50;
    pixels.data[i + 2] *= 0.5;
  }
  return pixels;
};

const rgbSplit = (pixels) => {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i];
    pixels.data[i + 100] = pixels.data[i + 1];
    pixels.data[i - 150] = pixels.data[i + 2];
  }
  return pixels;
};

const withinRange = (upper, lower, value) => ((value > lower) && (value < upper));

const greenScreen = (pixels) => {
  const levels = {};
  const inputs = document.querySelectorAll('.rgb input');
  inputs.forEach((input) => { levels[input.name] = Number(input.value); });

  for (let i = 0; i < pixels.data.length; i += 4) {
    const red = pixels.data[i];
    const green = pixels.data[i + 1];
    const blue = pixels.data[i + 2];
    const {
      rmin,
      rmax,
      gmin,
      gmax,
      bmin,
      bmax,
    } = levels;

    if (withinRange(rmin, rmax, red)
      && withinRange(gmin, gmax, green)
      && withinRange(bmin, bmax, blue)) {
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
};

const paintToCanvas = () => {
  const { videoWidth: width, videoHeight: height } = video;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height);
    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    pixels = greenScreen(pixels);
    ctx.putImageData(pixels, 0, 0);
  }, 50);
};

const takePhoto = () => {
  snap.currentTime = 0;
  snap.play();
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'pretty');
  link.innerHTML = `<image src=${data} alt="awesome lady" />`;

  strip.insertBefore(link, strip.firstChild);
};

getVideo();
video.addEventListener('canplay', paintToCanvas);
