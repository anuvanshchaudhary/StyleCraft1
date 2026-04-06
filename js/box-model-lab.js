const initialState = {
    width: 200,
    height: 200,
    padding: 20,
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    margin: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    backgroundColor: '#FFD100',
    containerColor: '#FFFFFF',
    showLabels: true
};
let store = { ...initialState };
const previewBox = document.getElementById('preview-box');
const outerContainer = document.getElementById('outer-container');
const cssCodeBlock = document.getElementById('css-code');
const resetButton = document.getElementById('btn-reset');
const contentVisualizer = document.getElementById('content-visualizer');
const marginVisualizer = document.getElementById('margin-visualizer');
const inputs = {
    width: document.getElementById('width'),
    height: document.getElementById('height'),
    padding: document.getElementById('padding'),
    paddingTop: document.getElementById('paddingTop'),
    paddingRight: document.getElementById('paddingRight'),
    paddingBottom: document.getElementById('paddingBottom'),
    paddingLeft: document.getElementById('paddingLeft'),
    margin: document.getElementById('margin'),
    marginTop: document.getElementById('marginTop'),
    marginRight: document.getElementById('marginRight'),
    marginBottom: document.getElementById('marginBottom'),
    marginLeft: document.getElementById('marginLeft'),
    backgroundColor: document.getElementById('backgroundColor'),
    containerColor: document.getElementById('containerColor'),
    showLabels: document.getElementById('showLabels')
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
    previewBox.style.paddingTop = `${store.paddingTop}px`;
    previewBox.style.paddingRight = `${store.paddingRight}px`;
    previewBox.style.paddingBottom = `${store.paddingBottom}px`;
    previewBox.style.paddingLeft = `${store.paddingLeft}px`;
    previewBox.style.marginTop = `${store.marginTop}px`;
    previewBox.style.marginRight = `${store.marginRight}px`;
    previewBox.style.marginBottom = `${store.marginBottom}px`;
    previewBox.style.marginLeft = `${store.marginLeft}px`;
    previewBox.style.backgroundColor = store.backgroundColor;
    outerContainer.style.backgroundColor = store.containerColor;
    if (store.showLabels) {
        contentVisualizer.style.opacity = '1';
        marginVisualizer.classList.add('border-dashed');
    } else {
        contentVisualizer.style.opacity = '0';
        marginVisualizer.classList.remove('border-dashed');
    }
    Object.keys(displays).forEach(key => {
        if (displays[key]) {
            displays[key].innerText = store[key] + 'px';
        }
    });
    const cssString = `.element {
  width: ${store.width}px;
  height: ${store.height}px;
  padding-top: ${store.paddingTop}px;
  padding-right: ${store.paddingRight}px;
  padding-bottom: ${store.paddingBottom}px;
  padding-left: ${store.paddingLeft}px;
  margin-top: ${store.marginTop}px;
  margin-right: ${store.marginRight}px;
  margin-bottom: ${store.marginBottom}px;
  margin-left: ${store.marginLeft}px;
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
        if (key === 'padding') {
            ['Top', 'Right', 'Bottom', 'Left'].forEach(side => {
                store[`padding${side}`] = val;
                inputs[`padding${side}`].value = val;
            });
        }
        if (key === 'margin') {
            ['Top', 'Right', 'Bottom', 'Left'].forEach(side => {
                store[`margin${side}`] = val;
                inputs[`margin${side}`].value = val;
            });
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
