document.addEventListener('DOMContentLoaded', () => {
    // Game state variables
    let gameActive = false;
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let scores = { X: 0, O: 0 };
    let playerNames = { X: 'Player X', O: 'Player O' };
    let soundEnabled = true;
    
    // DOM Elements
    const statusDisplay = document.getElementById('status');
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const restartButton = document.getElementById('restart-button');
    const newGameButton = document.getElementById('new-game-button');
    const startGameButton = document.getElementById('start-game');
    const gameSetupSection = document.getElementById('game-setup');
    const gameBoardSection = document.getElementById('game-board-section');
    const playerXInput = document.getElementById('player-x');
    const playerOInput = document.getElementById('player-o');
    const playerXNameDisplay = document.getElementById('player-x-name');
    const playerONameDisplay = document.getElementById('player-o-name');
    const scoreXDisplay = document.getElementById('score-x');
    const scoreODisplay = document.getElementById('score-o');
    const soundToggle = document.getElementById('sound-toggle');
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    // Audio elements
    const clickSound = document.getElementById('click-sound');
    const winSound = document.getElementById('win-sound');
    const drawSound = document.getElementById('draw-sound');
    
    // Winning conditions - indexes of the game board that form a winning line
    const winningConditions = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Diagonal top-left to bottom-right
        [2, 4, 6]  // Diagonal top-right to bottom-left
    ];
    
    // Messages for game status
    const winningMessage = () => `${playerNames[currentPlayer]} wins!`;
    const drawMessage = () => `Game ended in a draw!`;
    const currentPlayerTurn = () => `${playerNames[currentPlayer]}'s turn`;
    
    // Initialize the game
    function initializeGame() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        statusDisplay.innerHTML = currentPlayerTurn();
        
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('x', 'o', 'highlight', 'pop');
        });
        
        updateScoreDisplay();
    }
    
    // Handle cell click
    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));
        
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    }
    
    // Update cell after it's played
    function handleCellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase(), 'pop');
        
        if (soundEnabled) {
            clickSound.currentTime = 0;
            clickSound.play();
        }
    }
    
    // Validate result after each move
    function handleResultValidation() {
        let roundWon = false;
        let winningLine = null;
        
        // Check all winning conditions
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const condition = gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c];
            
            if (condition) {
                roundWon = true;
                winningLine = winningConditions[i];
                break;
            }
        }
        
        // If someone won
        if (roundWon) {
            statusDisplay.innerHTML = winningMessage();
            gameActive = false;
            
            // Highlight winning cells
            winningLine.forEach(index => {
                document.querySelector(`[data-cell-index="${index}"]`).classList.add('highlight');
            });
            
            // Update score
            scores[currentPlayer]++;
            updateScoreDisplay();
            
            // Play win sound and show confetti
            if (soundEnabled) {
                winSound.play();
            }
            
            // Trigger confetti effect
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            
            return;
        }
        
        // Check for a draw
        let roundDraw = !gameState.includes('');
        if (roundDraw) {
            statusDisplay.innerHTML = drawMessage();
            gameActive = false;
            
            if (soundEnabled) {
                drawSound.play();
            }
            
            return;
        }
        
        // If no win or draw, switch players
        handlePlayerChange();
    }
    
    // Switch players
    function handlePlayerChange() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.innerHTML = currentPlayerTurn();
    }
    
    // Update score display
    function updateScoreDisplay() {
        scoreXDisplay.textContent = scores.X;
        scoreODisplay.textContent = scores.O;
        playerXNameDisplay.textContent = playerNames.X;
        playerONameDisplay.textContent = playerNames.O;
    }
    
    // Start a new game with current player names
    function startNewGame() {
        // Get player names from input fields
        playerNames.X = playerXInput.value.trim() || 'Player X';
        playerNames.O = playerOInput.value.trim() || 'Player O';
        
        // Hide setup, show game board
        gameSetupSection.classList.add('hidden');
        gameBoardSection.classList.remove('hidden');
        
        // Initialize the game
        initializeGame();
    }
    
    // Reset scores and start a new game
    function handleNewGame() {
        scores = { X: 0, O: 0 };
        gameSetupSection.classList.remove('hidden');
        gameBoardSection.classList.add('hidden');
    }
    
    // Apply theme
    function applyTheme(themeName) {
        document.body.className = '';
        if (themeName !== 'default') {
            document.body.classList.add(`${themeName}-theme`);
        }
        
        // Update active theme button
        themeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-theme') === themeName) {
                btn.classList.add('active');
            }
        });
    }
    
    // Event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    restartButton.addEventListener('click', initializeGame);
    newGameButton.addEventListener('click', handleNewGame);
    startGameButton.addEventListener('click', startNewGame);
    
    soundToggle.addEventListener('change', () => {
        soundEnabled = soundToggle.checked;
    });
    
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const themeName = btn.getAttribute('data-theme');
            applyTheme(themeName);
        });
    });
});