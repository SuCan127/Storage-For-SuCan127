// Quantumult X script to change the font size of specific elements to 100px

(function() {
    let modifyFontSize = () => {
        // Target the elements based on the data attribute or class names
        let targetElements = document.querySelectorAll('[data-v-8a7b341d] li');
        
        // Change the font size of the targeted elements to 100px
        targetElements.forEach(element => {
            element.style.fontSize = '100px';
        });
    };

    // Run the function after the page has fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', modifyFontSize);
    } else {
        modifyFontSize();
    }
})();
