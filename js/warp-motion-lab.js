const initialState = {
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    translateX: 0,
    translateY: 0,
    perspective: 1000,
    blur: 0,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    hueRotate: 0,
    duration: 0.3,
    timingFunction: 'ease'
};
let store = { ...initialState };
const previewBox = document.getElementById('preview-box');
const previewArea = document.getElementById('preview-area');
const cssCodeBlock = document.getElementById('css-code');
const resetButton = document.getElementById('btn-reset');
const inputs = {
    rotate: document.getElementById('rotate'),
    rotateX: document.getElementById('rotateX'),
    rotateY: document.getElementById('rotateY'),
    scale: document.getElementById('scale'),
    skewX: document.getElementById('skewX'),
    translateX: document.getElementById('translateX'),
    translateY: document.getElementById('translateY'),
    perspective: document.getElementById('perspective'),
    blur: document.getElementById('blur'),
    brightness: document.getElementById('brightness'),
    contrast: document.getElementById('contrast'),
    grayscale: document.getElementById('grayscale'),
    hueRotate: document.getElementById('hueRotate'),
    duration: document.getElementById('duration'),
    timingFunction: document.getElementById('timingFunction')
};
const displays = {};
Object.keys(inputs).forEach(key => {
    if (inputs[key] && inputs[key].type === 'range') {
        const displayEl = document.getElementById(`${key}-val`);
        if (displayEl) displays[key] = displayEl;
    }
});
function updatePreview() {
    const transformStr = `
        perspective(${store.perspective}px)
        rotate(${store.rotate}deg) 
        rotateX(${store.rotateX}deg) 
        rotateY(${store.rotateY}deg) 
        scale(${store.scale}) 
        skewX(${store.skewX}deg) 
        translate(${store.translateX}px, ${store.translateY}px)
    `.replace(/\s+/g, ' ').trim();
    const filterStr = `
        blur(${store.blur}px) 
        brightness(${store.brightness}%) 
        contrast(${store.contrast}%) 
        grayscale(${store.grayscale}%) 
        hue-rotate(${store.hueRotate}deg)
    `.replace(/\s+/g, ' ').trim();
    previewBox.style.transform = transformStr;
    previewBox.style.filter = filterStr;
    previewBox.style.transition = `all ${store.duration}s ${store.timingFunction}`;
    Object.keys(displays).forEach(key => {
        if (displays[key]) {
            let unit = '';
            if (key === 'rotate' || key.includes('rotate') || key === 'rotateX' || key === 'rotateY' || key === 'skewX' || key === 'hueRotate') unit = 'deg';
            else if (key === 'translateX' || key === 'translateY' || key === 'blur' || key === 'perspective') unit = 'px';
            else if (key === 'brightness' || key === 'contrast' || key === 'grayscale') unit = '%';
            else if (key === 'duration') unit = 's';
            displays[key].innerText = store[key] + unit;
        }
    });
    const cssString = `.element {
  transform: ${transformStr};
  filter: ${filterStr};
  transition: all ${store.duration}s ${store.timingFunction};
}
.element:hover {
  filter: brightness(1.2);
}`;
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
resetButton.addEventListener('click', () => {
    store = { ...initialState };
    syncInputs();
    updatePreview();
});
syncInputs();
updatePreview();
