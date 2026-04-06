const initialState = {
    animationName: 'float',
    duration: 2,
    timingFunction: 'ease',
    delay: 0,
    iterationCount: 'infinite',
    direction: 'normal',
    fillMode: 'both',
    playState: 'running',
    originX: 50,
    originY: 50
};

let store = { ...initialState };

// DOM Elements
const previewBox = document.getElementById('preview-box');
const cssCodeBlock = document.getElementById('css-code');
const resetButton = document.getElementById('btn-reset');

// Inputs
const inputs = {
    animationName: document.getElementById('animationName'),
    duration: document.getElementById('duration'),
    timingFunction: document.getElementById('timingFunction'),
    delay: document.getElementById('delay'),
    iterationCount: document.getElementById('iterationCount'),
    direction: document.getElementById('direction'),
    fillMode: document.getElementById('fillMode'),
    playState: document.getElementById('playState'),
    originX: document.getElementById('originX'),
    originY: document.getElementById('originY')
};

// Value Displays
const displays = {};
Object.keys(inputs).forEach(key => {
    if (inputs[key] && inputs[key].type === 'range') {
        const displayEl = document.getElementById(`${key}-val`);
        if (displayEl) displays[key] = displayEl;
    }
});

function updatePreview() {
    // We need to re-apply the animation string to trigger it
    previewBox.style.animation = 'none';
    
    // Forced reflow
    void previewBox.offsetWidth;
    
    const animationStr = `${store.animationName} ${store.duration}s ${store.timingFunction} ${store.delay}s ${store.iterationCount} ${store.direction} ${store.fillMode} ${store.playState}`;
    
    previewBox.style.animation = animationStr;
    previewBox.style.transformOrigin = `${store.originX}% ${store.originY}%`;

    // Update displays
    Object.keys(displays).forEach(key => {
        if (displays[key]) {
            displays[key].innerText = store[key] + (key === 'originX' || key === 'originY' ? '%' : 's');
        }
    });

    // Generate CSS Code
    const cssString = `.element {
  animation: ${animationStr};
  transform-origin: ${store.originX}% ${store.originY}%;
}

/* Keyframes for ${store.animationName} */
@keyframes ${store.animationName} {
  /* ... details of ${store.animationName} animation ... */
}`;
    
    cssCodeBlock.textContent = cssString;
}

function syncInputs() {
    Object.keys(inputs).forEach(key => {
        if (!inputs[key]) return;
        inputs[key].value = store[key];
    });
}

// Event Listeners
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

// Initialize
syncInputs();
updatePreview();
