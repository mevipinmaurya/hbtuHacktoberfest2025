/**
 * Color Palette Generator
 * Generates random color palettes and allows copying hex codes
 */

/**
 * Generates a random hex color code
 * @returns {string} Random hex color (e.g., "#A3B2C4")
 */
function generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Generates a palette of 5 random colors
 * Creates color boxes and adds them to the DOM
 */
function generatePalette() {
    const paletteContainer = document.getElementById('paletteContainer');
    paletteContainer.innerHTML = ''; // Clear existing palette

    // Generate 5 color boxes
    for (let i = 0; i < 5; i++) {
        const color = generateRandomColor();
        const colorBox = createColorBox(color);
        paletteContainer.appendChild(colorBox);
    }
}

/**
 * Creates a color box element
 * @param {string} color - Hex color code
 * @returns {HTMLElement} Color box div element
 */
function createColorBox(color) {
    const colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    colorBox.style.backgroundColor = color;
    
    colorBox.innerHTML = `
        <div class="color-code">${color}</div>
    `;

    // Add click event to copy color code
    colorBox.addEventListener('click', () => copyToClipboard(color));
    
    return colorBox;
}

/**
 * Copies text to clipboard and shows notification
 * @param {string} text - Text to copy (hex color code)
 */
function copyToClipboard(text) {
    // Use modern Clipboard API
    navigator.clipboard.writeText(text).then(() => {
        showNotification();
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        fallbackCopyToClipboard(text);
    });
}

/**
 * Fallback copy method for older browsers
 * @param {string} text - Text to copy
 */
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification();
    } catch (err) {
        console.error('Fallback copy failed: ', err);
    }
    
    document.body.removeChild(textArea);
}

/**
 * Shows notification message temporarily
 */
function showNotification() {
    const notification = document.getElementById('notification');
    notification.style.display = 'block';
    
    // Hide notification after 2 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

/**
 * Allows generating new palette with spacebar
 */
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scroll
        generatePalette();
    }
});

// Generate initial palette on page load
window.addEventListener('load', generatePalette);
