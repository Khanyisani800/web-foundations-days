const noteText = document.getElementById('note-text');
const charCount = document.getElementById('char-count');
const wordCount = document.getElementById('word-count');
const clearBtn = document.getElementById('clear-btn');
const themeToggle = document.getElementById('theme-toggle');

// Function to update character and word counters and warning classes
function updateCounts() {
    const text = noteText.value;
    const characters = text.length;
    
    // Count words (splitting by spaces and filtering out empty strings)
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

    charCount.textContent = `${characters} / 200 characters`;
    wordCount.textContent = `${words} words`;

    // Handle warning and over classes
    charCount.className = '';
    if (characters > 200) {
        charCount.classList.add('over');
    } else if (characters > 180) {
        charCount.classList.add('warning');
    }
}

// Event listener for input events
noteText.addEventListener('input', () => {
    updateCounts();
    localStorage.setItem('note-draft', noteText.value);
});

// Clear button functionality
clearBtn.addEventListener('click', () => {
    noteText.value = '';
    localStorage.removeItem('note-draft');
    updateCounts();
});

// Escape key functionality inside textarea
noteText.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        noteText.value = '';
        localStorage.removeItem('note-draft');
        updateCounts();
    }
});

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Restore draft and theme when page loads
window.addEventListener('DOMContentLoaded', () => {
    const savedDraft = localStorage.getItem('note-draft');
    if (savedDraft !== null) {
        noteText.value = savedDraft;
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = 'Light mode';
    }

    updateCounts();
});
