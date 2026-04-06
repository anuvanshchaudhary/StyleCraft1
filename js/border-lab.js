const initialState = {
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: '#000000',
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderRadius: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    outlineWidth: 0,
    outlineStyle: 'solid',
    outlineColor: '#FF00FF',
    outlineOffset: 0,
    boxShadowX: 8,
    boxShadowY: 8,
    boxShadowBlur: 0,
    boxShadowSpread: 0,
    boxShadowColor: '#000000',
    backgroundColor: '#FFD100',
    width: 200,
    height: 200,
};
let store = { ...initialState };
const previewBox = document.getElementById('preview-box');
const cssCodeBlock = document.getElementById('css-code');
const resetButton = document.getElementById('btn-reset');
const inputs = {
    borderWidth: document.getElementById('borderWidth'),
    borderStyle: document.getElementById('borderStyle'),
    borderColor: document.getElementById('borderColor'),
    borderTopWidth: document.getElementById('borderTopWidth'),
    borderRightWidth: document.getElementById('borderRightWidth'),
    borderBottomWidth: document.getElementById('borderBottomWidth'),
    borderLeftWidth: document.getElementById('borderLeftWidth'),
    borderRadius: document.getElementById('borderRadius'),
    borderTopLeftRadius: document.getElementById('borderTopLeftRadius'),
    borderTopRightRadius: document.getElementById('borderTopRightRadius'),
    borderBottomRightRadius: document.getElementById('borderBottomRightRadius'),
    borderBottomLeftRadius: document.getElementById('borderBottomLeftRadius'),
    outlineWidth: document.getElementById('outlineWidth'),
    outlineStyle: document.getElementById('outlineStyle'),
    outlineColor: document.getElementById('outlineColor'),
    outlineOffset: document.getElementById('outlineOffset'),
    boxShadowX: document.getElementById('boxShadowX'),
    boxShadowY: document.getElementById('boxShadowY'),
    boxShadowBlur: document.getElementById('boxShadowBlur'),
    boxShadowSpread: document.getElementById('boxShadowSpread'),
    boxShadowColor: document.getElementById('boxShadowColor'),
    width: document.getElementById('width'),
    height: document.getElementById('height'),
    backgroundColor: document.getElementById('backgroundColor')
};
const displays = {};
Object.keys(inputs).forEach(key => {
    if (inputs[key] && inputs[key].type === 'range') {
        const displayEl = document.getElementById(`${key}-val`);
        if (displayEl) displays[key] = displayEl;
    }
});
function updatePreview() {
    previewBox.style.width = `${store.width}px`;
    previewBox.style.height = `${store.height}px`;
    previewBox.style.backgroundColor = store.backgroundColor;
    previewBox.style.borderWidth = `${store.borderTopWidth}px ${store.borderRightWidth}px ${store.borderBottomWidth}px ${store.borderLeftWidth}px`;
    previewBox.style.borderStyle = store.borderStyle;
    previewBox.style.borderColor = store.borderColor;
    previewBox.style.borderRadius = `${store.borderTopLeftRadius}px ${store.borderTopRightRadius}px ${store.borderBottomRightRadius}px ${store.borderBottomLeftRadius}px`;
    previewBox.style.outlineWidth = `${store.outlineWidth}px`;
    previewBox.style.outlineStyle = store.outlineStyle;
    previewBox.style.outlineColor = store.outlineColor;
    previewBox.style.outlineOffset = `${store.outlineOffset}px`;
    previewBox.style.boxShadow = `${store.boxShadowX}px ${store.boxShadowY}px ${store.boxShadowBlur}px ${store.boxShadowSpread}px ${store.boxShadowColor}`;
    Object.keys(displays).forEach(key => {
        if (displays[key]) {
            displays[key].innerText = store[key] + (
                key === 'boxShadowX' || key === 'boxShadowY' || key === 'boxShadowBlur' || key === 'boxShadowSpread' || key.includes('Width') || key.includes('Radius') || key === 'width' || key === 'height' || key === 'outlineOffset' ? 'px' : ''
            );
        }
    });
    const cssString = `.element {
  border-width: ${store.borderWidth}px;
  border-style: ${store.borderStyle};
  border-color: ${store.borderColor};
  border-top-width: ${store.borderTopWidth}px;
  border-right-width: ${store.borderRightWidth}px;
  border-bottom-width: ${store.borderBottomWidth}px;
  border-left-width: ${store.borderLeftWidth}px;
  border-radius: ${store.borderRadius}px;
  border-top-left-radius: ${store.borderTopLeftRadius}px;
  border-top-right-radius: ${store.borderTopRightRadius}px;
  border-bottom-right-radius: ${store.borderBottomRightRadius}px;
  border-bottom-left-radius: ${store.borderBottomLeftRadius}px;
  outline-width: ${store.outlineWidth}px;
  outline-style: ${store.outlineStyle};
  outline-color: ${store.outlineColor};
  outline-offset: ${store.outlineOffset}px;
  box-shadow: ${store.boxShadowX}px ${store.boxShadowY}px ${store.boxShadowBlur}px ${store.boxShadowSpread}px ${store.boxShadowColor};
  width: ${store.width}px;
  height: ${store.height}px;
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
Object.keys(inputs).forEach(key => {
    if (!inputs[key]) return;
    inputs[key].addEventListener('input', (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        store[key] = val;
        if (key === 'borderWidth') {
            store.borderTopWidth = val;
            store.borderRightWidth = val;
            store.borderBottomWidth = val;
            store.borderLeftWidth = val;
            inputs.borderTopWidth.value = val;
            inputs.borderRightWidth.value = val;
            inputs.borderBottomWidth.value = val;
            inputs.borderLeftWidth.value = val;
        }
        if (key === 'borderRadius') {
            store.borderTopLeftRadius = val;
            store.borderTopRightRadius = val;
            store.borderBottomRightRadius = val;
            store.borderBottomLeftRadius = val;
            inputs.borderTopLeftRadius.value = val;
            inputs.borderTopRightRadius.value = val;
            inputs.borderBottomRightRadius.value = val;
            inputs.borderBottomLeftRadius.value = val;
        }
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
