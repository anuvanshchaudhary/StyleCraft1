const initialState = {
    fontSize: 24,
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    lineHeight: 1.5,
    letterSpacing: 0,
    textAlign: 'left',
    textTransform: 'none',
    textDecoration: 'none',
    fontStyleItalic: false,
    color: '#000000',
    backgroundColor: '#FFFFFF',
};

let store = { ...initialState };

// DOM Elements
const previewText = document.getElementById('preview-text');
const previewContainer = document.getElementById('preview-container');
const cssCodeBlock = document.getElementById('css-code');
const resetButton = document.getElementById('btn-reset');

// Inputs
const inputs = {
    fontSize: document.getElementById('fontSize'),
    fontWeight: document.getElementById('fontWeight'),
    fontFamily: document.getElementById('fontFamily'),
    lineHeight: document.getElementById('lineHeight'),
    letterSpacing: document.getElementById('letterSpacing'),
    textTransform: document.getElementById('textTransform'),
    textDecoration: document.getElementById('textDecoration'),
    fontStyleItalic: document.getElementById('fontStyleItalic'),
    color: document.getElementById('color'),
    backgroundColor: document.getElementById('backgroundColor')
};

// Custom Buttons
const attrButtons = document.querySelectorAll('.attr-btn');

// Value Displays
const displays = {};
Object.keys(inputs).forEach(key => {
    if (inputs[key] && inputs[key].type === 'range') {
        const displayEl = document.getElementById(`${key}-val`);
        if (displayEl) displays[key] = displayEl;
    }
});

function updatePreview() {
    // Apply styles to text
    previewText.style.fontSize = `${store.fontSize}px`;
    previewText.style.fontWeight = store.fontWeight;
    previewText.style.fontFamily = store.fontFamily;
    previewText.style.lineHeight = store.lineHeight;
    previewText.style.letterSpacing = `${store.letterSpacing}px`;
    previewText.style.textAlign = store.textAlign;
    previewText.style.textTransform = store.textTransform;
    previewText.style.textDecoration = store.textDecoration;
    previewText.style.fontStyle = store.fontStyleItalic ? 'italic' : 'normal';
    previewText.style.color = store.color;
    
    // Apply container bg
    previewContainer.style.backgroundColor = store.backgroundColor;

    // Update displays
    Object.keys(displays).forEach(key => {
        if (displays[key]) {
            let unit = '';
            if (key === 'fontSize' || key === 'letterSpacing') unit = 'px';
            displays[key].innerText = store[key] + unit;
        }
    });

    // Update buttons
    attrButtons.forEach(btn => {
        const name = btn.dataset.name;
        const val = btn.dataset.value;
        if (store[name] === val) {
            btn.classList.add('bg-neo-pink');
            btn.classList.remove('bg-white');
        } else {
            btn.classList.remove('bg-neo-pink');
            btn.classList.add('bg-white');
        }
    });

    // Generate CSS Code
    const cssString = `.element {
  font-family: ${store.fontFamily};
  font-size: ${store.fontSize}px;
  font-weight: ${store.fontWeight};
  line-height: ${store.lineHeight};
  letter-spacing: ${store.letterSpacing}px;
  text-align: ${store.textAlign};
  text-transform: ${store.textTransform};
  text-decoration: ${store.textDecoration};
  font-style: ${store.fontStyleItalic ? 'italic' : 'normal'};
  color: ${store.color};
  
  /* Container Bg */
  background-color: ${store.backgroundColor};
}`;
    
    cssCodeBlock.textContent = cssString;
}

function syncInputs() {
    Object.keys(inputs).forEach(key => {
        if (!inputs[key]) return;
        if (inputs[key].type === 'checkbox') {
            inputs[key].checked = store[key];
        } else {
            inputs[key].value = store[key];
        }
    });
}

// Event Listeners
Object.keys(inputs).forEach(key => {
    if (!inputs[key]) return;
    
    inputs[key].addEventListener('input', (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        store[key] = val;
        updatePreview();
    });
});

attrButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const val = btn.dataset.value;
        store[name] = val;
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
