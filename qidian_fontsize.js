// Quantumult X Script to change all fonts to 21px on a webpage

let modifyFontSize = () => {
    let style = document.createElement('style');
    style.innerHTML = `* { font-size: 21px !important; }`;
    document.head.appendChild(style);
};

// Run the function to modify font size after the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', modifyFontSize);
} else {
    modifyFontSize();
}
