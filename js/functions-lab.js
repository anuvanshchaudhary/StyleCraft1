const initialState = {
    // Math/Mix (Inner Box)
    mixColor1: '#FF00FF',
    mixColor2: '#00FF41',
    mixPercent: 50,
    colorSpace: 'srgb',
    // Gradient (Bg)
    gradType: 'linear-gradient',
    gradAngle: 90,
    gradColor1: '#FFD100',
    gradColor2: '#FF00FF',
    // Blend/Opacity
    blendMode: 'normal',
    boxOpacity: 1
};

let store = { ...initialState };

// DOM Elements
const gradientContainer = document.getElementById('gradient-container');
const colorMixBox = document.getElementById('color-mix-box');
const cssCodeBlock = document.getElementById('css-code');
const resetButton = document.getElementById('btn-reset');

// Inputs
const inputs = {
    mixColor1: document.getElementById('mixColor1'),
    mixColor2: document.getElementById('mixColor2'),
    mixPercent: document.getElementById('mixPercent'),
    colorSpace: document.getElementById('colorSpace'),

    gradType: document.getElementById('gradType'),
    gradAngle: document.getElementById('gradAngle'),
    gradColor1: document.getElementById('gradColor1'),
    gradColor2: document.getElementById('gradColor2'),

    blendMode: document.getElementById('blendMode'),
    boxOpacity: document.getElementById('boxOpacity')
};

// Value Displays
const displays = {
    mixPercent: document.getElementById('mixPercent-val'),
    gradAngle: document.getElementById('gradAngle-val'),
    boxOpacity: document.getElementById('boxOpacity-val')
};

function updatePreview() {
    // 1. Color Mix
    const colorMixStr = `color-mix(in ${store.colorSpace}, ${store.mixColor1} ${store.mixPercent}%, ${store.mixColor2})`;
    
    // 2. Gradient
    let gradientStr = '';
    if (store.gradType === 'linear-gradient') {
        gradientStr = `linear-gradient(${store.gradAngle}deg, ${store.gradColor1}, ${store.gradColor2})`;
    } else if (store.gradType === 'radial-gradient') {
        gradientStr = `radial-gradient(circle, ${store.gradColor1}, ${store.gradColor2})`;
    } else {
        gradientStr = `conic-gradient(from ${store.gradAngle}deg, ${store.gradColor1}, ${store.gradColor2}, ${store.gradColor1})`;
    }

    // Apply styles to elements
    gradientContainer.style.background = gradientStr;
    
    colorMixBox.style.backgroundColor = colorMixStr;
    colorMixBox.style.mixBlendMode = store.blendMode;
    colorMixBox.style.opacity = store.boxOpacity;

    // Update value displays
    if (displays.mixPercent) displays.mixPercent.innerText = store.mixPercent + '%';
    if (displays.gradAngle) displays.gradAngle.innerText = store.gradAngle + 'deg';
    if (displays.boxOpacity) displays.boxOpacity.innerText = store.boxOpacity;

    // Update CSS syntax
    const cssString = `.background-container {
  background: ${gradientStr};
}

.inner-box {
  background-color: ${colorMixStr};
  mix-blend-mode: ${store.blendMode};
  opacity: ${store.boxOpacity};
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
