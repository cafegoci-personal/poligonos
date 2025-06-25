// Kandinsky Art Experience - JavaScript for 6-year-old children.
let currentStep = 1;
let symphonyScore = 0;
let selectedTool = 'circle';
let selectedColor = 'blue';
let artworkElements = [];
let audioContext;

// Progress tracking variables.
let shapesFelt = [];
let elementsCreated = 0;
let minElementsRequired = 5;

// Edit mode variables.
let currentMode = 'create'; // 'create' or 'edit'
let selectedElement = null;
let elementCounter = 0;

// Drag and drop variables.
let isDragging = false;
let isResizing = false;
let isRotating = false;
let dragStartX = 0;
let dragStartY = 0;
let elementStartX = 0;
let elementStartY = 0;
let startScale = 1;
let startRotation = 0;
let rotationCenter = { x: 0, y: 0 };

// Kandinsky's color-emotion theory.
const kandinskiColors = {
    blue: { emotion: 'tranquilo', sound: 'grave', frequency: 220 },
    red: { emotion: 'cálido', sound: 'fuerte', frequency: 440 },
    yellow: { emotion: 'brillante', sound: 'agudo', frequency: 880 },
    green: { emotion: 'pacífico', sound: 'natural', frequency: 330 },
    purple: { emotion: 'misterioso', sound: 'profundo', frequency: 165 },
    orange: { emotion: 'energético', sound: 'vibrante', frequency: 660 },
    black: { emotion: 'silencioso', sound: 'silencio', frequency: 55 },
    white: { emotion: 'puro', sound: 'cristalino', frequency: 1760 }
};

// Shape characteristics according to Kandinsky.
const kandinskiShapes = {
    circle: { emotion: 'suave', movement: 'flotante', sound: 'continuo' },
    triangle: { emotion: 'puntiagudo', movement: 'ascendente', sound: 'penetrante' },
    square: { emotion: 'estable', movement: 'firme', sound: 'sólido' },
    line: { emotion: 'dinámico', movement: 'direccional', sound: 'fluido' }
};

// Initialize the Kandinsky experience.
document.addEventListener('DOMContentLoaded', function() {
    initializeKandinskiExperience();
});

// Initialize all Kandinsky components.
function initializeKandinskiExperience() {
    createFloatingShapes();
    setupSynesthesiaGame();
    setupAbstractStudio();
    initializeAudioContext();
    updateProgressBar();
    setCurrentDate();
}

// Create floating background shapes.
function createFloatingShapes() {
    const container = document.getElementById('floatingShapes');
    const shapes = ['circle', 'triangle', 'square'];
    const colors = ['blue', 'red', 'yellow', 'green', 'purple', 'orange'];
    
    for (let i = 0; i < 15; i++) {
        const shape = document.createElement('div');
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        shape.className = `floating-shape kandinsky-${randomShape} ${randomColor}`;
        shape.style.left = Math.random() * 100 + '%';
        shape.style.top = Math.random() * 100 + '%';
        shape.style.animationDelay = Math.random() * 5 + 's';
        shape.style.animationDuration = (Math.random() * 10 + 10) + 's';
        
        container.appendChild(shape);
    }
}

// Initialize Web Audio Context for synesthesia sounds.
function initializeAudioContext() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API not supported.');
    }
}

// Move to next step.
function nextStep() {
    if (currentStep < 4) {
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
        
        // Special actions for gallery step.
        if (currentStep === 4) {
            displayArtworkInGallery();
        }
    }
}

// Update progress bar.
function updateProgressBar() {
    const circles = document.querySelectorAll('.progress-circle');
    circles.forEach((circle, index) => {
        const stepNumber = index + 1;
        if (stepNumber < currentStep) {
            circle.classList.add('completed');
            circle.classList.remove('active');
        } else if (stepNumber === currentStep) {
            circle.classList.add('active');
            circle.classList.remove('completed');
        } else {
            circle.classList.remove('active', 'completed');
        }
    });
}

// Feel shape emotions (Step 1).
function feelShape(shapeType) {
    const emotionCard = document.querySelector(`[data-shape="${shapeType}"]`);
    const shape = emotionCard.querySelector(`.kandinsky-${shapeType}`);
    
    // Check if already felt this shape.
    if (shapesFelt.includes(shapeType)) {
        return;
    }
    
    // Visual feedback.
    emotionCard.classList.add('feeling');
    shape.classList.add('feeling-pulse');
    
    // Play shape sound.
    playShapeSound(shapeType);
    
    // Show emotion message.
    showEmotionMessage(shapeType);
    
    // Mark shape as felt.
    shapesFelt.push(shapeType);
    updateShapeProgress();
    
    // Show completion badge.
    const badge = document.getElementById(`${shapeType}-badge`);
    badge.style.display = 'block';
    badge.classList.add('badge-appear');
    
    // Remove effects after animation.
    setTimeout(() => {
        emotionCard.classList.remove('feeling');
        shape.classList.remove('feeling-pulse');
    }, 2000);
}

// Show emotion message.
function showEmotionMessage(shapeType) {
    const messages = {
        circle: '¡El círculo te abraza suavemente! 🤗',
        triangle: '¡El triángulo te da energía! ⚡',
        square: '¡El cuadrado te da tranquilidad! 🏠'
    };
    
    // Create floating message.
    const message = document.createElement('div');
    message.className = 'emotion-message';
    message.textContent = messages[shapeType];
    
    const emotionCard = document.querySelector(`[data-shape="${shapeType}"]`);
    emotionCard.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 3000);
}

// Setup synesthesia game (Step 2).
function setupSynesthesiaGame() {
    const musicalShapes = document.querySelectorAll('.musical-shape');
    
    musicalShapes.forEach(shape => {
        shape.addEventListener('click', function() {
            if (this.classList.contains('played')) {
                return; // Already played.
            }
            
            const soundType = this.dataset.sound;
            const colorType = this.dataset.color;
            
            // Mark as played.
            this.classList.add('played');
            
            // Play synesthetic sound.
            playSynesthesiaSound(soundType, colorType);
            
            // Visual feedback.
            this.classList.add('sound-pulse');
            
            // Update symphony score.
            symphonyScore++;
            document.getElementById('symphony-score').textContent = symphonyScore;
            
            // Create sound waves.
            createSoundWaves(colorType);
            
            // Check if symphony complete.
            if (symphonyScore >= 6) {
                setTimeout(() => {
                    document.getElementById('step2-next').style.display = 'block';
                    celebrateSymphony();
                }, 1000);
            }
        });
    });
}

// Play synesthesia sound.
function playSynesthesiaSound(shapeType, colorType) {
    if (!audioContext) return;
    
    const colorInfo = kandinskiColors[colorType];
    const shapeInfo = kandinskiShapes[shapeType];
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Frequency based on color.
    oscillator.frequency.setValueAtTime(colorInfo.frequency, audioContext.currentTime);
    
    // Wave type based on shape.
    const waveTypes = {
        circle: 'sine',
        triangle: 'sawtooth',
        square: 'square',
        line: 'triangle'
    };
    oscillator.type = waveTypes[shapeType] || 'sine';
    
    // Volume and duration.
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1.5);
}

// Play shape sound.
function playShapeSound(shapeType) {
    if (!audioContext) return;
    
    const frequencies = {
        circle: 440,
        triangle: 880,
        square: 220
    };
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequencies[shapeType], audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
}

// Create sound waves visualization.
function createSoundWaves(color) {
    const wavesContainer = document.getElementById('soundWaves');
    
    for (let i = 0; i < 5; i++) {
        const wave = document.createElement('div');
        wave.className = `sound-wave ${color}`;
        wave.style.animationDelay = (i * 0.2) + 's';
        wavesContainer.appendChild(wave);
        
        setTimeout(() => {
            if (wave.parentNode) {
                wave.remove();
            }
        }, 2000);
    }
}

// Celebrate symphony completion.
function celebrateSymphony() {
    const stage = document.querySelector('.synesthesia-stage');
    stage.classList.add('symphony-complete');
    
    // Play celebration chord.
    if (audioContext) {
        const frequencies = [440, 554, 659]; // A major chord.
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 2);
            }, index * 300);
        });
    }
}

// Setup abstract art studio (Step 3).
function setupAbstractStudio() {
    const canvas = document.getElementById('abstractCanvas');
    
    canvas.addEventListener('click', function(e) {
        // Check if clicking on an element in edit mode.
        if (currentMode === 'edit' && e.target !== canvas) {
            return; // Element click will be handled by element's own listener.
        }
        
        // Only create new elements in create mode.
        if (currentMode === 'create') {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            addArtElement(x, y);
        }
    });
}

// Add art element to canvas.
function addArtElement(x, y) {
    const canvas = document.getElementById('abstractCanvas');
    const element = document.createElement('div');
    
    element.className = `kandinsky-${selectedTool} ${selectedColor} canvas-element`;
    element.style.position = 'absolute';
    element.style.left = (x - 25) + 'px';
    element.style.top = (y - 25) + 'px';
    element.style.cursor = 'pointer';
    element.dataset.elementId = `element-${elementCounter++}`;
    element.dataset.scale = '1';
    element.dataset.rotation = '0';
    
    // No rotation for better shape recognition and building.
    // Triangles don't use scale transform, only border scaling.
    if (selectedTool === 'triangle') {
        element.style.transform = 'rotate(0deg)';
    } else {
        element.style.transform = 'rotate(0deg) scale(1)';
    }
    
    // Add interaction functionality based on current mode.
    element.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (currentMode === 'create') {
            // Remove functionality in create mode - only with double click.
            // Single click does nothing in create mode.
            return;
        } else if (currentMode === 'edit') {
            // Select functionality in edit mode.
            selectElement(this);
        }
    });
    
    // Double click to delete in create mode.
    element.addEventListener('dblclick', function(e) {
        e.stopPropagation();
        
        if (currentMode === 'create') {
            if (confirm('¿Quieres quitar este elemento?')) {
                this.remove();
                elementsCreated--;
                updateCreationProgress();
                updateArtworkElements();
            }
        }
    });
    
    // Add drag and drop functionality.
    setupDragAndDrop(element);
    
    canvas.appendChild(element);
    
    // Add creation animation.
    element.style.animation = 'elementAppear 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    
    // Store artwork element.
    artworkElements.push({
        tool: selectedTool,
        color: selectedColor,
        x: x,
        y: y,
        rotation: 0,
        scale: 1,
        elementId: element.dataset.elementId
    });
    
    // Update progress.
    elementsCreated++;
    updateCreationProgress();
    
    // Play creation sound.
    playCreationSound();
}

// Play creation sound.
function playCreationSound() {
    if (!audioContext) return;
    
    const colorInfo = kandinskiColors[selectedColor];
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(colorInfo.frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

// Set current mode (create or edit).
function setMode(mode) {
    currentMode = mode;
    
    // Update mode buttons.
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${mode}-mode`).classList.add('active');
    
    // Clear selection when switching modes.
    if (selectedElement) {
        selectedElement.classList.remove('selected');
        selectedElement = null;
        document.getElementById('editControls').style.display = 'none';
    }
    
    // Update canvas cursor.
    const canvas = document.getElementById('abstractCanvas');
    const editHint = document.getElementById('editHint');
    
    if (mode === 'create') {
        canvas.style.cursor = 'crosshair';
        if (editHint) editHint.style.display = 'none';
    } else {
        canvas.style.cursor = 'default';
        if (editHint) editHint.style.display = 'block';
    }
}

// Select element for editing.
function selectElement(element) {
    // Clear previous selection.
    if (selectedElement) {
        selectedElement.classList.remove('selected');
    }
    
    // Select new element.
    selectedElement = element;
    element.classList.add('selected');
    
    // Show edit controls.
    const editControls = document.getElementById('editControls');
    editControls.style.display = 'block';
    
    // Update size slider.
    const currentScale = parseFloat(element.dataset.scale) || 1;
    const sizeSlider = document.getElementById('sizeSlider');
    const sizeValue = document.getElementById('sizeValue');
    
    sizeSlider.value = currentScale;
    sizeValue.textContent = Math.round(currentScale * 100) + '%';
}

// Resize selected element.
function resizeSelected() {
    if (!selectedElement) return;
    
    const sizeSlider = document.getElementById('sizeSlider');
    const sizeValue = document.getElementById('sizeValue');
    const scale = parseFloat(sizeSlider.value);
    
    selectedElement.dataset.scale = scale;
    const currentRotation = parseFloat(selectedElement.dataset.rotation) || 0;
    
    // Apply transform - triangles need special handling.
    if (selectedElement.classList.contains('kandinsky-triangle')) {
        const baseLeftBorder = 25;
        const baseRightBorder = 25;
        const baseBottomBorder = 43;
        
        selectedElement.style.borderLeftWidth = (baseLeftBorder * scale) + 'px';
        selectedElement.style.borderRightWidth = (baseRightBorder * scale) + 'px';
        selectedElement.style.borderBottomWidth = (baseBottomBorder * scale) + 'px';
        selectedElement.style.transform = `rotate(${currentRotation}deg)`;
    } else {
        selectedElement.style.transform = `rotate(${currentRotation}deg) scale(${scale})`;
    }
    
    sizeValue.textContent = Math.round(scale * 100) + '%';
    
    // Update artwork elements array.
    updateArtworkElements();
}

// Move selected element.
function moveSelected(direction) {
    if (!selectedElement) return;
    
    const moveDistance = 10;
    let currentLeft = parseInt(selectedElement.style.left);
    let currentTop = parseInt(selectedElement.style.top);
    
    switch (direction) {
        case 'up':
            currentTop = Math.max(0, currentTop - moveDistance);
            break;
        case 'down':
            currentTop = Math.min(400, currentTop + moveDistance);
            break;
        case 'left':
            currentLeft = Math.max(0, currentLeft - moveDistance);
            break;
        case 'right':
            currentLeft = Math.min(560, currentLeft + moveDistance);
            break;
    }
    
    selectedElement.style.left = currentLeft + 'px';
    selectedElement.style.top = currentTop + 'px';
    
    // Update artwork elements array.
    updateArtworkElements();
}

// Duplicate selected element.
function duplicateSelected() {
    if (!selectedElement) return;
    
    const rect = selectedElement.getBoundingClientRect();
    const canvasRect = document.getElementById('abstractCanvas').getBoundingClientRect();
    
    // Position duplicate slightly offset.
    const x = rect.left - canvasRect.left + 30;
    const y = rect.top - canvasRect.top + 30;
    
    // Get original element properties.
    const originalTool = selectedTool;
    const originalColor = selectedColor;
    
    // Set tool and color to match selected element.
    const classes = selectedElement.className.split(' ');
    selectedTool = classes[0].replace('kandinsky-', '');
    selectedColor = classes[1];
    
    // Create duplicate.
    addArtElement(x, y);
    
    // Restore original tool and color.
    selectedTool = originalTool;
    selectedColor = originalColor;
}

// Delete selected element.
function deleteSelected() {
    if (!selectedElement) return;
    
    if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
        selectedElement.remove();
        selectedElement = null;
        
        document.getElementById('editControls').style.display = 'none';
        
        elementsCreated--;
        updateCreationProgress();
        updateArtworkElements();
    }
}

// Setup drag and drop functionality for an element.
function setupDragAndDrop(element) {
    // Mouse events.
    element.addEventListener('mousedown', startDragOperation);
    element.addEventListener('mousemove', updateCursor);
    element.addEventListener('mouseleave', resetCursor);
    
    // Touch events for mobile.
    element.addEventListener('touchstart', startDragOperation, { passive: false });
}

// Update cursor based on mouse position.
function updateCursor(e) {
    if (currentMode !== 'edit' || !e.currentTarget.classList.contains('selected')) {
        hideOperationTooltip();
        return;
    }
    
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;
    
    // Remove all cursor classes.
    element.classList.remove('resize-cursor', 'rotate-cursor');
    
    let tooltipText = '✋ Arrastra para mover';
    
    // Add appropriate cursor class and tooltip.
    if (relativeX > 0.6 && relativeY > 0.6) {
        element.classList.add('resize-cursor');
        tooltipText = '↘️ Arrastra para redimensionar';
    } else if (relativeX > 0.6 && relativeY < 0.4) {
        element.classList.add('rotate-cursor');
        tooltipText = '🔄 Arrastra para rotar';
    }
    
    showOperationTooltip(e.clientX, e.clientY, tooltipText);
}

// Show operation tooltip.
function showOperationTooltip(x, y, text) {
    const tooltip = document.getElementById('operationTooltip');
    if (!tooltip) return;
    
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    tooltip.style.left = (x + 10) + 'px';
    tooltip.style.top = (y - 30) + 'px';
}

// Hide operation tooltip.
function hideOperationTooltip() {
    const tooltip = document.getElementById('operationTooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// Reset cursor when mouse leaves element.
function resetCursor(e) {
    const element = e.currentTarget;
    element.classList.remove('resize-cursor', 'rotate-cursor');
    hideOperationTooltip();
}

// Start drag operation - determines type based on click position and key modifiers.
function startDragOperation(e) {
    if (currentMode !== 'edit') return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Calculate relative position within element (0-1).
    const relativeX = (clientX - rect.left) / rect.width;
    const relativeY = (clientY - rect.top) / rect.height;
    
    // Determine operation type based on position and modifiers.
    let operationType = 'move'; // Default operation.
    
    // Corner areas for resize (bottom-right corner).
    if (relativeX > 0.6 && relativeY > 0.6) {
        operationType = 'resize';
    }
    // Top-right corner for rotation.
    else if (relativeX > 0.6 && relativeY < 0.4) {
        operationType = 'rotate';
    }
    // Shift key for resize, Ctrl/Cmd key for rotate.
    else if (e.shiftKey) {
        operationType = 'resize';
    }
    else if (e.ctrlKey || e.metaKey) {
        operationType = 'rotate';
    }
    
    // Select element first.
    selectElement(element);
    
    // Start appropriate operation.
    switch (operationType) {
        case 'move':
            startDragMove(e, element);
            break;
        case 'resize':
            startResize(e, element);
            break;
        case 'rotate':
            console.log('Starting rotation operation'); // Debug log.
            startRotate(e, element);
            break;
    }
}

// Start drag move operation.
function startDragMove(e, element) {
    if (currentMode !== 'edit') return;
    
    e.preventDefault();
    e.stopPropagation();
    
    isDragging = true;
    selectedElement = element;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    dragStartX = clientX;
    dragStartY = clientY;
    elementStartX = parseInt(element.style.left);
    elementStartY = parseInt(element.style.top);
    
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', dragMove, { passive: false });
    document.addEventListener('touchend', stopDrag);
    
    element.style.cursor = 'grabbing';
    element.classList.add('dragging');
    document.body.style.userSelect = 'none';
}

// Start resize operation.
function startResize(e, element) {
    if (currentMode !== 'edit') return;
    
    e.preventDefault();
    e.stopPropagation();
    
    isResizing = true;
    selectedElement = element;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    dragStartX = clientX;
    dragStartY = clientY;
    startScale = parseFloat(element.dataset.scale) || 1;
    
    document.addEventListener('mousemove', resizeMove);
    document.addEventListener('mouseup', stopResize);
    document.addEventListener('touchmove', resizeMove, { passive: false });
    document.addEventListener('touchend', stopResize);
    
    element.classList.add('resizing');
    document.body.style.userSelect = 'none';
}

// Start rotate operation.
function startRotate(e, element) {
    if (currentMode !== 'edit') return;
    
    e.preventDefault();
    e.stopPropagation();
    
    isRotating = true;
    selectedElement = element;
    
    const rect = element.getBoundingClientRect();
    rotationCenter.x = rect.left + rect.width / 2;
    rotationCenter.y = rect.top + rect.height / 2;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Get current rotation or start from 0.
    const currentRotation = parseFloat(element.dataset.rotation) || 0;
    startRotation = Math.atan2(clientY - rotationCenter.y, clientX - rotationCenter.x) * 180 / Math.PI - currentRotation;
    
    document.addEventListener('mousemove', rotateMove);
    document.addEventListener('mouseup', stopRotate);
    document.addEventListener('touchmove', rotateMove, { passive: false });
    document.addEventListener('touchend', stopRotate);
    
    element.classList.add('rotating');
    document.body.style.userSelect = 'none';
}

// Handle drag move.
function dragMove(e) {
    if (!isDragging || !selectedElement) return;
    
    e.preventDefault();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - dragStartX;
    const deltaY = clientY - dragStartY;
    
    const newX = Math.max(0, Math.min(560, elementStartX + deltaX));
    const newY = Math.max(0, Math.min(400, elementStartY + deltaY));
    
    selectedElement.style.left = newX + 'px';
    selectedElement.style.top = newY + 'px';
}

// Handle resize move.
function resizeMove(e) {
    if (!isResizing || !selectedElement) return;
    
    e.preventDefault();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - dragStartX;
    const deltaY = clientY - dragStartY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    const scaleFactor = distance > 0 ? (distance / 100) : 0;
    const newScale = Math.max(0.3, Math.min(3, startScale + scaleFactor * (deltaX > 0 ? 1 : -1)));
    
    selectedElement.dataset.scale = newScale;
    const currentRotation = parseFloat(selectedElement.dataset.rotation) || 0;
    
    // Apply transform - triangles need special handling.
    if (selectedElement.classList.contains('kandinsky-triangle')) {
        // For triangles, we need to also scale the border properties.
        const baseLeftBorder = 25;
        const baseRightBorder = 25;
        const baseBottomBorder = 43;
        
        selectedElement.style.borderLeftWidth = (baseLeftBorder * newScale) + 'px';
        selectedElement.style.borderRightWidth = (baseRightBorder * newScale) + 'px';
        selectedElement.style.borderBottomWidth = (baseBottomBorder * newScale) + 'px';
        selectedElement.style.transform = `rotate(${currentRotation}deg)`;
    } else {
        selectedElement.style.transform = `rotate(${currentRotation}deg) scale(${newScale})`;
    }
    
    // Update size slider if visible.
    const sizeSlider = document.getElementById('sizeSlider');
    const sizeValue = document.getElementById('sizeValue');
    if (sizeSlider && sizeValue) {
        sizeSlider.value = newScale;
        sizeValue.textContent = Math.round(newScale * 100) + '%';
    }
}

// Handle rotate move.
function rotateMove(e) {
    if (!isRotating || !selectedElement) return;
    
    e.preventDefault();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const currentAngle = Math.atan2(clientY - rotationCenter.y, clientX - rotationCenter.x) * 180 / Math.PI;
    let rotation = currentAngle - startRotation;
    
    // Keep rotation within reasonable bounds.
    while (rotation < 0) rotation += 360;
    while (rotation >= 360) rotation -= 360;
    
    selectedElement.dataset.rotation = rotation;
    const currentScale = parseFloat(selectedElement.dataset.scale) || 1;
    
    // Apply transform - triangles need special handling.
    if (selectedElement.classList.contains('kandinsky-triangle')) {
        selectedElement.style.transform = `rotate(${rotation}deg)`;
    } else {
        selectedElement.style.transform = `rotate(${rotation}deg) scale(${currentScale})`;
    }
}

// Stop drag operation.
function stopDrag() {
    if (!isDragging) return;
    
    isDragging = false;
    
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', dragMove);
    document.removeEventListener('touchend', stopDrag);
    
    if (selectedElement) {
        selectedElement.style.cursor = 'pointer';
        selectedElement.classList.remove('dragging');
    }
    
    document.body.style.userSelect = '';
    updateArtworkElements();
}

// Stop resize operation.
function stopResize() {
    if (!isResizing) return;
    
    isResizing = false;
    
    document.removeEventListener('mousemove', resizeMove);
    document.removeEventListener('mouseup', stopResize);
    document.removeEventListener('touchmove', resizeMove);
    document.removeEventListener('touchend', stopResize);
    
    if (selectedElement) {
        selectedElement.classList.remove('resizing');
    }
    
    document.body.style.userSelect = '';
    updateArtworkElements();
}

// Stop rotate operation.
function stopRotate() {
    if (!isRotating) return;
    
    isRotating = false;
    
    document.removeEventListener('mousemove', rotateMove);
    document.removeEventListener('mouseup', stopRotate);
    document.removeEventListener('touchmove', rotateMove);
    document.removeEventListener('touchend', stopRotate);
    
    if (selectedElement) {
        selectedElement.classList.remove('rotating');
    }
    
    document.body.style.userSelect = '';
    updateArtworkElements();
}

// Select tool.
function selectTool(tool) {
    selectedTool = tool;
    
    // Update tool buttons.
    document.querySelectorAll('.tool').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-shape="${tool}"]`).classList.add('active');
}

// Select color.
function selectColor(color) {
    selectedColor = color;
    
    // Update color buttons.
    document.querySelectorAll('.color-tool').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-color="${color}"]`).classList.add('active');
}

// Clear canvas.
function clearCanvas() {
    if (confirm('¿Estás seguro de que quieres limpiar tu obra de arte?')) {
        const canvas = document.getElementById('abstractCanvas');
        const elements = canvas.querySelectorAll('.canvas-element');
        elements.forEach(element => element.remove());
        artworkElements = [];
        elementsCreated = 0;
        updateCreationProgress();
    }
}

// Get inspiration.
function getInspiration() {
    const panel = document.getElementById('inspirationPanel');
    const inspirations = [
        'Un círculo azul que flota en el cielo',
        'Triángulos amarillos que bailan juntos',
        'Líneas negras que cruzan el espacio',
        'Cuadrados rojos que forman una casa',
        'Colores que se mezclan como un arcoíris',
        'Formas que cuentan una historia',
        'Un jardín abstracto de colores',
        'Música convertida en formas'
    ];
    
    // Show random inspirations.
    const list = document.getElementById('inspirationList');
    list.innerHTML = '';
    
    const randomInspirations = inspirations.sort(() => 0.5 - Math.random()).slice(0, 4);
    randomInspirations.forEach(inspiration => {
        const li = document.createElement('li');
        li.textContent = inspiration;
        list.appendChild(li);
    });
    
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

// Play composition (sonify the artwork).
function playComposition() {
    if (!audioContext || artworkElements.length === 0) {
        alert('¡Primero crea algunas formas en tu lienzo!');
        return;
    }
    
    const visualizer = document.getElementById('soundVisualizer');
    visualizer.style.display = 'block';
    
    artworkElements.forEach((element, index) => {
        setTimeout(() => {
            const colorInfo = kandinskiColors[element.color];
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(colorInfo.frequency, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.8);
            
            // Visual feedback.
            const dot = document.createElement('div');
            dot.className = `visualizer-dot ${element.color}`;
            visualizer.appendChild(dot);
            
            setTimeout(() => {
                if (dot.parentNode) {
                    dot.remove();
                }
            }, 800);
            
        }, index * 500);
    });
    
    setTimeout(() => {
        visualizer.style.display = 'none';
    }, artworkElements.length * 500 + 1000);
}

// Update artwork elements.
function updateArtworkElements() {
    const canvas = document.getElementById('abstractCanvas');
    const elements = canvas.querySelectorAll('.canvas-element');
    artworkElements = Array.from(elements).map(element => ({
        tool: element.classList[0].replace('kandinsky-', ''),
        color: element.classList[1],
        x: parseInt(element.style.left),
        y: parseInt(element.style.top),
        scale: parseFloat(element.dataset.scale) || 1,
        rotation: parseFloat(element.dataset.rotation) || 0,
        elementId: element.dataset.elementId
    }));
}

// Display artwork in gallery.
function displayArtworkInGallery() {
    const galleryDisplay = document.getElementById('artworkDisplay');
    galleryDisplay.innerHTML = '';
    
    if (artworkElements.length === 0) {
        galleryDisplay.innerHTML = '<p>¡Vuelve al paso anterior para crear tu obra de arte!</p>';
        return;
    }
    
    // Clone artwork elements for display.
    artworkElements.forEach(element => {
        const artElement = document.createElement('div');
        artElement.className = `kandinsky-${element.tool} ${element.color} gallery-element`;
        artElement.style.position = 'absolute';
        artElement.style.left = (element.x * 0.6) + 'px'; // Scale down for gallery.
        artElement.style.top = (element.y * 0.6) + 'px';
        
        const galleryScale = 0.6 * (element.scale || 1); // Include original scale.
        const galleryRotation = element.rotation || 0; // Include original rotation.
        
        // Handle triangles specially in gallery.
        if (element.tool === 'triangle') {
            const baseLeftBorder = 25;
            const baseRightBorder = 25;
            const baseBottomBorder = 43;
            const finalScale = galleryScale;
            
            artElement.style.borderLeftWidth = (baseLeftBorder * finalScale) + 'px';
            artElement.style.borderRightWidth = (baseRightBorder * finalScale) + 'px';
            artElement.style.borderBottomWidth = (baseBottomBorder * finalScale) + 'px';
            artElement.style.transform = `rotate(${galleryRotation}deg)`;
        } else {
            artElement.style.transform = `rotate(${galleryRotation}deg) scale(${galleryScale})`;
        }
        
        galleryDisplay.appendChild(artElement);
    });
}

// Set current date.
function setCurrentDate() {
    const now = new Date();
    const dateString = now.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('artDate').textContent = dateString;
    document.getElementById('certificateDate').textContent = dateString;
}

// Save artwork.
function saveArtwork() {
    if (artworkElements.length === 0) {
        alert('¡Primero crea algo de arte para guardar!');
        return;
    }
    
    // Simulate saving.
    const artData = {
        elements: artworkElements,
        date: new Date().toISOString(),
        artist: document.getElementById('artistName').value || 'Artista Anónimo'
    };
    
    localStorage.setItem('kandinskiArt', JSON.stringify(artData));
    alert('🎨 ¡Tu obra de arte ha sido guardada! ¡Eres un verdadero artista como Kandinsky!');
}

// Share artwork.
function shareArtwork() {
    if (artworkElements.length === 0) {
        alert('¡Primero crea algo de arte para compartir!');
        return;
    }
    
    const artistName = document.getElementById('artistName').value || 'Artista Anónimo';
    const shareText = `¡Mira mi arte abstracto inspirado en Kandinsky! Creé ${artworkElements.length} elementos usando formas y colores que tienen sentimientos. - ${artistName}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Mi Arte Kandinsky',
            text: shareText
        });
    } else {
        // Fallback for browsers without native sharing.
        navigator.clipboard.writeText(shareText).then(() => {
            alert('¡Texto copiado! Ahora puedes pegarlo donde quieras compartir tu arte.');
        });
    }
}

// Print certificate.
function printCertificate() {
    const artistName = document.getElementById('artistName').value;
    if (!artistName) {
        alert('¡Primero escribe tu nombre para el certificado!');
        return;
    }
    
    // Create printable certificate.
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Certificado de Artista Kandinsky</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .certificate { border: 5px solid #ffd700; padding: 30px; margin: 20px; }
                .certificate h1 { color: #d4af37; margin-bottom: 20px; }
                .certificate p { font-size: 18px; margin: 10px 0; }
                .artist-name { font-size: 24px; font-weight: bold; color: #333; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="certificate">
                <h1>🏆 Certificado de Artista Abstracto 🏆</h1>
                <p>Este certifica que</p>
                <div class="artist-name">${artistName}</div>
                <p>ha creado arte abstracto al estilo de <strong>Wassily Kandinsky</strong></p>
                <p>y entiende que las formas y colores tienen sentimientos y hacen música</p>
                <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
                <p>🎨 ¡Felicitaciones, joven artista! 🎨</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Print artwork.
function printArtwork() {
    if (artworkElements.length === 0) {
        alert('¡Primero crea algo de arte para imprimir!');
        return;
    }
    
    const artistName = document.getElementById('artistName').value || 'Artista Anónimo';
    
    // Get the actual canvas elements to replicate exactly what's shown.
    const canvas = document.getElementById('abstractCanvas');
    const canvasElements = canvas.querySelectorAll('.canvas-element');
    
    // Create printable artwork.
    const printWindow = window.open('', '_blank');
    
    // Build artwork HTML by using the stored positions from style.left and style.top.
    let artworkHTML = '';
    canvasElements.forEach(element => {
        // Get position directly from element styles (these are already canvas-relative).
        // Add border offset to account for canvas border (5px border + any padding).
        const x = (parseInt(element.style.left) || 0) + 5;
        const y = (parseInt(element.style.top) || 0) + 5;
        
        // Get element properties.
        const classes = element.className.split(' ');
        const tool = classes[0].replace('kandinsky-', '');
        const color = classes[1];
        const scale = parseFloat(element.dataset.scale) || 1;
        const rotation = parseFloat(element.dataset.rotation) || 0;
        
        let shapeCSS = '';
        
        // Define shape-specific CSS based on actual element.
        if (tool === 'circle') {
            shapeCSS = `
                width: ${50 * scale}px;
                height: ${50 * scale}px;
                border-radius: 50%;
                background-color: ${color};
            `;
        } else if (tool === 'triangle') {
            const borderSize = 25 * scale;
            shapeCSS = `
                width: 0;
                height: 0;
                border-left: ${borderSize}px solid transparent;
                border-right: ${borderSize}px solid transparent;
                border-bottom: ${borderSize * 1.7}px solid ${color};
                background-color: transparent;
            `;
        } else if (tool === 'square') {
            shapeCSS = `
                width: ${50 * scale}px;
                height: ${50 * scale}px;
                background-color: ${color};
                border-radius: 6px;
            `;
        } else if (tool === 'line') {
            shapeCSS = `
                width: ${50 * scale}px;
                height: ${5 * scale}px;
                background-color: ${color};
                border-radius: 2px;
            `;
        }
        
        // Build transform string with scale and rotation.
        let transformString = '';
        if (scale !== 1 || rotation !== 0) {
            transformString = `scale(${scale}) rotate(${rotation}deg)`;
        }
        
        artworkHTML += `
            <div style="
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                ${shapeCSS}
                transform: ${transformString};
                filter: drop-shadow(3px 6px 12px rgba(0, 0, 0, 0.1));
            "></div>
        `;
    });
    
    printWindow.document.write(`
        <html>
        <head>
            <title>Mi Arte Kandinsky - ${artistName}</title>
            <style>
                body { 
                    margin: 0; 
                    padding: 20px; 
                    font-family: Arial, sans-serif;
                }
                .artwork-container {
                    position: relative;
                    width: 600px;
                    height: 450px;
                    border: 5px dashed #3b82f6;
                    border-radius: 20px;
                    margin: 20px auto;
                    background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
                    box-shadow: inset 0 2px 10px rgba(59, 130, 246, 0.1);
                }
                .artwork-info {
                    text-align: center;
                    margin: 20px;
                }
                .artist-signature {
                    font-size: 18px;
                    font-weight: bold;
                    margin: 10px 0;
                }
                .art-date {
                    font-size: 14px;
                    color: #666;
                }
                .kandinsky-quote {
                    font-style: italic;
                    color: #444;
                    margin: 20px 0;
                    font-size: 16px;
                }
                @media print {
                    body { margin: 0; }
                    .artwork-container { page-break-inside: avoid; }
                }
            </style>
        </head>
        <body>
            <div class="artwork-info">
                <h1>🎨 Mi Arte Abstracto Kandinsky 🎨</h1>
                <div class="artist-signature">Por: ${artistName}</div>
                <div class="art-date">${new Date().toLocaleDateString('es-ES')}</div>
            </div>
            
            <div class="artwork-container">
                ${artworkHTML}
            </div>
            
            <div class="artwork-info">
                <div class="kandinsky-quote">
                    "El color es el teclado, los ojos son los martillos,<br>
                    el alma es el piano con muchas cuerdas." - Wassily Kandinsky
                </div>
                <p>Esta obra contiene ${artworkElements.length} elementos artísticos</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Update shape discovery progress (Step 1).
function updateShapeProgress() {
    const counter = document.getElementById('shapes-felt');
    const stars = document.getElementById('discovery-stars');
    
    counter.textContent = shapesFelt.length;
    
    // Add stars for each discovered shape.
    stars.innerHTML = '';
    for (let i = 0; i < shapesFelt.length; i++) {
        const star = document.createElement('span');
        star.textContent = '⭐';
        star.className = 'discovery-star';
        star.style.animationDelay = (i * 0.3) + 's';
        stars.appendChild(star);
    }
    
    // Check if all shapes discovered.
    if (shapesFelt.length >= 3) {
        setTimeout(() => {
            document.getElementById('step1-next').style.display = 'block';
            showCompletionMessage('¡Felicitaciones! Has descubierto todas las formas mágicas. 🎉');
        }, 1000);
    }
}

// Update art creation progress (Step 3).
function updateCreationProgress() {
    const counter = document.getElementById('elements-created');
    const progress = document.getElementById('creation-progress');
    
    counter.textContent = elementsCreated;
    
    // Update progress bar.
    progress.innerHTML = '';
    const percentage = (elementsCreated / minElementsRequired) * 100;
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.width = Math.min(percentage, 100) + '%';
    progress.appendChild(progressBar);
    
    // Add progress dots.
    for (let i = 0; i < minElementsRequired; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        if (i < elementsCreated) {
            dot.classList.add('completed');
        }
        progress.appendChild(dot);
    }
    
    // Check if minimum elements created.
    if (elementsCreated >= minElementsRequired) {
        setTimeout(() => {
            document.getElementById('step3-next').style.display = 'block';
            showCompletionMessage('¡Increíble! Has creado una obra de arte digna de Kandinsky. 🎨');
        }, 500);
    } else {
        document.getElementById('step3-next').style.display = 'none';
    }
}

// Show completion message.
function showCompletionMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'completion-message';
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 4000);
}

// Start over.
function startOver() {
    if (confirm('¿Quieres empezar una nueva experiencia artística?')) {
        // Reset all state.
        currentStep = 1;
        symphonyScore = 0;
        artworkElements = [];
        selectedTool = 'circle';
        selectedColor = 'blue';
        shapesFelt = [];
        elementsCreated = 0;
        
        // Reset edit mode variables.
        currentMode = 'create';
        selectedElement = null;
        elementCounter = 0;
        
        // Reset drag and drop variables.
        isDragging = false;
        isResizing = false;
        isRotating = false;
        
        // Reset mode buttons.
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById('create-mode').classList.add('active');
        
        // Hide edit controls.
        document.getElementById('editControls').style.display = 'none';
        
        // Clear canvas.
        const canvas = document.getElementById('abstractCanvas');
        const elements = canvas.querySelectorAll('.canvas-element');
        elements.forEach(element => element.remove());
        
        // Reset all steps.
        document.querySelectorAll('.art-step').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById('step1').classList.add('active');
        
        // Reset progress bar.
        document.querySelectorAll('.progress-circle').forEach(circle => {
            circle.classList.remove('active', 'completed');
        });
        document.querySelector('[data-step="1"]').classList.add('active');
        
        // Reset synesthesia game.
        document.querySelectorAll('.musical-shape').forEach(shape => {
            shape.classList.remove('played', 'sound-pulse');
        });
        document.getElementById('symphony-score').textContent = '0';
        document.getElementById('step2-next').style.display = 'none';
        
        // Reset step 1 progress.
        document.querySelectorAll('.completion-badge').forEach(badge => {
            badge.style.display = 'none';
            badge.classList.remove('badge-appear');
        });
        document.getElementById('step1-next').style.display = 'none';
        updateShapeProgress();
        
        // Reset step 3 progress.
        document.getElementById('step3-next').style.display = 'none';
        updateCreationProgress();
        
        // Reset tools.
        document.querySelectorAll('.tool').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-shape="circle"]').classList.add('active');
        document.querySelectorAll('.color-tool').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-color="blue"]').classList.add('active');
        
        // Clear name input.
        document.getElementById('artistName').value = '';
        
        updateProgressBar();
    }
} 