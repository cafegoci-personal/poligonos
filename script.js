// Game state variables.
let currentStep = 1;
let identificationScore = 0;
let classificationScore = 0;
let totalPolygons = 4;
let totalClassifications = 4;

// Initialize the game when the page loads.
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});

// Initialize all game components.
function initializeGame() {
    setupIdentificationGame();
    setupDragAndDrop();
    updateProgressBar();
}

// Move to the next step in the learning process.
function nextStep() {
    if (currentStep < 3) {
        // Hide current step.
        document.getElementById(`step${currentStep}`).classList.remove('active');
        
        // Update progress bar.
        document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`[data-step="${currentStep}"]`).classList.add('completed');
        
        // Move to next step.
        currentStep++;
        
        // Show next step.
        document.getElementById(`step${currentStep}`).classList.add('active');
        document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
        
        updateProgressBar();
    }
}

// Update the visual progress bar.
function updateProgressBar() {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        if (stepNumber < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

// Setup the identification game for step 2.
function setupIdentificationGame() {
    const clickableShapes = document.querySelectorAll('.clickable-shape');
    
    clickableShapes.forEach(shape => {
        shape.addEventListener('click', function() {
            if (this.classList.contains('correct') || this.classList.contains('incorrect')) {
                return; // Already clicked.
            }
            
            if (this.classList.contains('polygon')) {
                // Correct answer.
                this.classList.add('correct');
                identificationScore++;
                playCorrectSound();
            } else {
                // Incorrect answer.
                this.classList.add('incorrect');
                playIncorrectSound();
                
                // Remove incorrect styling after animation.
                setTimeout(() => {
                    this.classList.remove('incorrect');
                }, 1000);
            }
            
            updateIdentificationScore();
            checkIdentificationComplete();
        });
    });
}

// Update the identification game score display.
function updateIdentificationScore() {
    document.getElementById('score').textContent = identificationScore;
}

// Check if the identification game is complete.
function checkIdentificationComplete() {
    if (identificationScore >= totalPolygons) {
        setTimeout(() => {
            document.getElementById('step2-next').style.display = 'block';
            celebrateSuccess();
        }, 500);
    }
}

// Setup drag and drop functionality for step 3.
function setupDragAndDrop() {
    const draggableShapes = document.querySelectorAll('.draggable-shape');
    const dropZones = document.querySelectorAll('.drop-zone');
    
    // Add drag event listeners to shapes.
    draggableShapes.forEach(shape => {
        shape.addEventListener('dragstart', handleDragStart);
        shape.addEventListener('dragend', handleDragEnd);
    });
    
    // Add drop event listeners to drop zones.
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragenter', handleDragEnter);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });
}

// Handle drag start event.
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.sides);
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.5';
}

// Handle drag end event.
function handleDragEnd(e) {
    e.target.style.opacity = '1';
}

// Handle drag over event.
function handleDragOver(e) {
    e.preventDefault();
}

// Handle drag enter event.
function handleDragEnter(e) {
    e.preventDefault();
    if (e.target.classList.contains('drop-zone') || e.target.closest('.drop-zone')) {
        const dropZone = e.target.classList.contains('drop-zone') ? e.target : e.target.closest('.drop-zone');
        dropZone.classList.add('dragover');
    }
}

// Handle drag leave event.
function handleDragLeave(e) {
    if (e.target.classList.contains('drop-zone') || e.target.closest('.drop-zone')) {
        const dropZone = e.target.classList.contains('drop-zone') ? e.target : e.target.closest('.drop-zone');
        dropZone.classList.remove('dragover');
    }
}

// Handle drop event.
function handleDrop(e) {
    e.preventDefault();
    
    const dropZone = e.target.classList.contains('drop-zone') ? e.target : e.target.closest('.drop-zone');
    dropZone.classList.remove('dragover');
    
    const shapeSides = e.dataTransfer.getData('text/plain');
    const shapeHTML = e.dataTransfer.getData('text/html');
    const targetCategory = dropZone.dataset.category;
    
    // Check if the shape belongs to this category.
    if (shapeSides === targetCategory) {
        // Correct placement.
        const dropArea = dropZone.querySelector('.drop-area');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = shapeHTML;
        const droppedShape = tempDiv.firstChild;
        
        // Remove draggable properties and add success styling.
        droppedShape.draggable = false;
        droppedShape.style.cursor = 'default';
        droppedShape.style.border = '2px solid #38a169';
        droppedShape.style.background = '#c6f6d5';
        
        dropArea.appendChild(droppedShape);
        
        // Remove the original shape.
        const originalShape = document.querySelector(`[data-sides="${shapeSides}"]`);
        if (originalShape && originalShape.parentNode) {
            originalShape.remove();
        }
        
        classificationScore++;
        playCorrectSound();
        updateClassificationScore();
        checkClassificationComplete();
        
    } else {
        // Incorrect placement - shape bounces back.
        playIncorrectSound();
        animateIncorrectDrop(dropZone);
    }
}

// Update the classification game score display.
function updateClassificationScore() {
    document.getElementById('final-score').textContent = classificationScore;
}

// Check if the classification game is complete.
function checkClassificationComplete() {
    if (classificationScore >= totalClassifications) {
        setTimeout(() => {
            document.getElementById('finish-btn').style.display = 'block';
            celebrateSuccess();
        }, 500);
    }
}

// Animate incorrect drop.
function animateIncorrectDrop(dropZone) {
    dropZone.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        dropZone.style.animation = '';
    }, 500);
}

// Finish the game and show success message.
function finishGame() {
    document.getElementById('success-message').style.display = 'block';
    confetti();
}

// Restart the entire game.
function restartGame() {
    // Reset game state.
    currentStep = 1;
    identificationScore = 0;
    classificationScore = 0;
    
    // Hide success message.
    document.getElementById('success-message').style.display = 'none';
    
    // Reset all steps.
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('step1').classList.add('active');
    
    // Reset progress bar.
    document.querySelectorAll('.progress-step').forEach(step => {
        step.classList.remove('active', 'completed');
    });
    document.querySelector('[data-step="1"]').classList.add('active');
    
    // Reset identification game.
    document.querySelectorAll('.clickable-shape').forEach(shape => {
        shape.classList.remove('correct', 'incorrect');
    });
    document.getElementById('score').textContent = '0';
    document.getElementById('step2-next').style.display = 'none';
    
    // Reset classification game.
    document.getElementById('final-score').textContent = '0';
    document.getElementById('finish-btn').style.display = 'none';
    
    // Restore draggable shapes.
    const draggableContainer = document.querySelector('.draggable-shapes');
    draggableContainer.innerHTML = `
        <div class="draggable-shape" draggable="true" data-sides="3">
            <div class="triangle orange"></div>
            <span>Triángulo</span>
        </div>
        <div class="draggable-shape" draggable="true" data-sides="4">
            <div class="square pink"></div>
            <span>Cuadrado</span>
        </div>
        <div class="draggable-shape" draggable="true" data-sides="4">
            <div class="rectangle cyan"></div>
            <span>Rectángulo</span>
        </div>
        <div class="draggable-shape" draggable="true" data-sides="3">
            <div class="triangle lime"></div>
            <span>Triángulo</span>
        </div>
    `;
    
    // Clear drop areas.
    document.querySelectorAll('.drop-area').forEach(area => {
        area.innerHTML = '';
    });
    
    // Reinitialize drag and drop.
    setupDragAndDrop();
}

// Play correct answer sound effect (visual feedback for now).
function playCorrectSound() {
    // Visual feedback - could add actual sound later.
    console.log('Correct! ✅');
}

// Play incorrect answer sound effect (visual feedback for now).
function playIncorrectSound() {
    // Visual feedback - could add actual sound later.
    console.log('Try again! ❌');
}

// Celebrate success with visual effects.
function celebrateSuccess() {
    // Create temporary celebration elements.
    const celebration = document.createElement('div');
    celebration.style.position = 'fixed';
    celebration.style.top = '50%';
    celebration.style.left = '50%';
    celebration.style.transform = 'translate(-50%, -50%)';
    celebration.style.fontSize = '4rem';
    celebration.style.zIndex = '999';
    celebration.innerHTML = '🎉';
    celebration.style.animation = 'bounce 1s ease';
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        if (celebration.parentNode) {
            celebration.remove();
        }
    }, 1000);
}

// Simple confetti effect for final celebration.
function confetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
    }
}

// Create individual confetti piece.
function createConfettiPiece(color) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = color;
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.zIndex = '1001';
    confetti.style.borderRadius = '50%';
    
    document.body.appendChild(confetti);
    
    // Animate falling.
    let position = -10;
    const fallSpeed = Math.random() * 3 + 2;
    const sway = Math.random() * 2 - 1;
    
    const fall = setInterval(() => {
        position += fallSpeed;
        confetti.style.top = position + 'px';
        confetti.style.left = (parseFloat(confetti.style.left) + sway) + 'px';
        
        if (position > window.innerHeight) {
            clearInterval(fall);
            if (confetti.parentNode) {
                confetti.remove();
            }
        }
    }, 20);
} 