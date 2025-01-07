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
}

function toggleMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    modeToggleButton.textContent = isWorkTime ? 'Rest Mode' : 'Work Mode';
    document.body.classList.toggle('rest-time', !isWorkTime);
    updateDisplay(timeLeft);
    
    // Reset timer state
    clearInterval(timerId);
    timerId = null;
    startButton.textContent = 'Start';
}

function startTimer() {
    const isTimerRunning = timerId !== null;
    
    if (isTimerRunning) {
        // Timer is running, pause it
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
        return;
    }

    // Start the timer
    startButton.textContent = 'Pause';
    
    if (!timeLeft) {
        timeLeft = WORK_TIME;
    }

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
    isWorkTime = true;
    timeLeft = WORK_TIME;
    startButton.textContent = 'Start';
    modeText.textContent = 'Work Time';
    updateDisplay(timeLeft);
}

// Initialize
timeLeft = WORK_TIME;
updateDisplay(timeLeft);

// Event listeners
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
modeToggleButton.addEventListener('click', toggleMode); 