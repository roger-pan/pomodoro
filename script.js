let timeLeft;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const modeToggleButton = document.getElementById('mode-toggle');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

const MATRIX_QUOTES = [
    "What is real? How do you define real?",
    "The Matrix is everywhere. It is all around us. Even now, in this very room. You can see it when you look out your window or when you turn on your television. You can feel it when you go to work... when you go to church... when you pay your taxes.",
    "I know kung fu.",
    "Show me.",
    "You take the blue pill—the story ends, you wake up in your bed and believe whatever you want to believe. You take the red pill—you stay in Wonderland, and I show you how deep the rabbit hole goes.",
    "Human beings are a disease, a cancer of this planet. You’re a plague. And we... are the cure.",
    "There’s a difference between knowing the path and walking the path."
];

const REST_QUOTES = [
    "Take a breath. You've earned it.",
    "Rest is not idleness, it is preparation for the next session.",
    "The time to relax is when you don't have time for it.",
    "Your mind will answer most questions if you learn to relax and wait for the answer."
];

const quoteText = document.getElementById('quote-text');
let currentQuoteIndex = 0;

// Define labels for work and rest modes
const WORK_MODE_INACTIVE_LABEL = "Plug into the Matrix";  // Work mode (inactive)
const WORK_MODE_ACTIVE_LABEL = "You're Plugged Into The Matrix";  // Work mode (active)
const REST_MODE_INACTIVE_LABEL = "Take The Blue Pill • Rest Mode";  // Rest mode (inactive)
const REST_MODE_ACTIVE_LABEL = "Taking a break from The Matrix";  // Rest mode (active)

function updateQuote() {
    const quotes = isWorkTime ? MATRIX_QUOTES : REST_QUOTES;
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    
    // Fade out current quote
    quoteText.style.opacity = '0';
    
    // Change text and fade in after a short delay
    setTimeout(() => {
        quoteText.textContent = quotes[currentQuoteIndex];
        quoteText.style.opacity = '1';
    }, 300);
}

function updateDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update the display
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update the browser tab title
    const mode = isWorkTime ? 'Work' : 'Break';
    document.title = `(${timeString}) ${mode} - Pomodoro Timer`;

    // Add ticker animation
    const timerDisplay = document.querySelector('.timer-display');
    timerDisplay.classList.add('ticker');  // Add ticker class

    // Remove the class after animation ends to reset
    setTimeout(() => {
        timerDisplay.classList.remove('ticker');
    }, 300);  // Match this duration with the CSS transition duration
}

function toggleMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    
    // Update mode text based on the current state
    if (isWorkTime) {
        modeText.textContent = WORK_MODE_INACTIVE_LABEL;  // When in work mode (inactive)
    } else {
        modeText.textContent = REST_MODE_INACTIVE_LABEL;  // When in rest mode (inactive)
    }
    
    modeToggleButton.textContent = isWorkTime ? '☕️' : '💊';
    document.body.classList.toggle('rest-time', !isWorkTime);
    updateDisplay(timeLeft);
    updateQuote();
    
    // Reset timer state
    clearInterval(timerId);
    timerId = null;
    startButton.textContent = 'Start';
}

function startTimer() {
    const isTimerRunning = timerId !== null;
    
    if (isTimerRunning) {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
        return;
    }

    startButton.textContent = 'Pause';
    
    if (!timeLeft) {
        timeLeft = WORK_TIME;
    }

    // Update the mode text based on current mode
    modeText.textContent = isWorkTime ? WORK_MODE_ACTIVE_LABEL : REST_MODE_ACTIVE_LABEL;

    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft);

        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            startButton.textContent = 'Start';
            toggleMode();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;

    // Check the current mode and set timeLeft accordingly
    if (isWorkTime) {
        timeLeft = WORK_TIME;  // Reset to 25 minutes for work mode
        modeText.textContent = WORK_MODE_INACTIVE_LABEL;  // Set label for reset state
    } else {
        timeLeft = BREAK_TIME;  // Reset to 5 minutes for rest mode
        modeText.textContent = REST_MODE_INACTIVE_LABEL;  // Set label for rest state
    }

    startButton.textContent = 'Start';
    updateDisplay(timeLeft);
}

// Initialize
timeLeft = WORK_TIME;
modeText.textContent = WORK_MODE_INACTIVE_LABEL;  // Set initial label text
updateDisplay(timeLeft);

// Event listeners
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
modeToggleButton.addEventListener('click', toggleMode); 

// Initialize with rest mode emoji since we start in work mode
modeToggleButton.textContent = '☕️'; 

// Initialize first quote
quoteText.textContent = MATRIX_QUOTES[0];

// Rotate quotes every 30 seconds
setInterval(updateQuote, 30000); 