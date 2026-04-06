const initialState = {
    duration: 2,
    timingFunction: 'ease-in-out',
    direction: 'alternate',
    startColor: '#FF00FF',
    startScale: 1,
    startRotate: 0,
    middleOffset: 50,
    middleColor: '#00FF41',
    middleScale: 1.5,
    middleRotate: 180,
    endColor: '#FFD100',
    endScale: 0.1,
    endRotate: 360
};
let store = { ...initialState };
const previewBox = document.getElementById('preview-box');
const dynamicKeyframes = document.getElementById('dynamic-keyframes');
const cssCodeBlock = document.getElementById('css-code');
const inputs = {
    duration: document.getElementById('duration'),
    timingFunction: document.getElementById('timingFunction'),
    direction: document.getElementById('direction'),
    startColor: document.getElementById('startColor'),
    startScale: document.getElementById('startScale'),
    startRotate: document.getElementById('startRotate'),
    middleOffset: document.getElementById('middleOffset'),
    middleColor: document.getElementById('middleColor'),
    middleScale: document.getElementById('middleScale'),
    middleRotate: document.getElementById('middleRotate'),
    endColor: document.getElementById('endColor'),
    endScale: document.getElementById('endScale'),
    endRotate: document.getElementById('endRotate')
};
const displays = {
    duration: document.getElementById('duration-val'),
    startScale: document.getElementById('startScale-val'),
    startRotate: document.getElementById('startRotate-val'),
    middleOffset: document.getElementById('middleOffset-val'),
    middleScale: document.getElementById('middleScale-val'),
    middleRotate: document.getElementById('middleRotate-val'),
    endScale: document.getElementById('endScale-val'),
    endRotate: document.getElementById('endRotate-val')
};
function updatePreview() {
    previewBox.style.animation = 'none';
    void previewBox.offsetWidth;
    const keyframeCSS = `
@keyframes funky-bounce {
  0% {
    background-color: ${store.startColor};
    transform: scale(${store.startScale}) rotate(${store.startRotate}deg);
  }
  ${store.middleOffset}% {
    background-color: ${store.middleColor};
    transform: scale(${store.middleScale}) rotate(${store.middleRotate}deg);
  }
  100% {
    background-color: ${store.endColor};
    transform: scale(${store.endScale}) rotate(${store.endRotate}deg);
  }
}`;
    dynamicKeyframes.textContent = keyframeCSS;
    const animationProps = `funky-bounce ${store.duration}s ${store.timingFunction} infinite ${store.direction} both`;
    previewBox.style.animation = animationProps;
    Object.keys(displays).forEach(key => {
        if (displays[key]) {
            displays[key].innerText = store[key];
        }
    });
    const cssString = `.element {
  animation-name: funky-bounce;
  animation-duration: ${store.duration}s;
  animation-timing-function: ${store.timingFunction};
  animation-iteration-count: infinite;
  animation-direction: ${store.direction};
  animation-fill-mode: both;
}
${keyframeCSS}`;
    cssCodeBlock.textContent = cssString;
}
function syncInputs() {
    Object.keys(inputs).forEach(key => {
        if (!inputs[key]) return;
        inputs[key].value = store[key];
    });
}
Object.keys(inputs).forEach(key => {
    if (!inputs[key]) return;
    inputs[key].addEventListener('input', (e) => {
        store[key] = e.target.value;
        updatePreview();
    });
});
syncInputs();
updatePreview();
