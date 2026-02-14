// Stage management
let currentStage = 0;
const totalQuestionStages = 3;
let answers = {};
let quizScore = 0;
let totalQuizQuestions = 6;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    startLiveCounter();
    setupDinnerDecider();
    initScratchCard();
    
    // Observe when dashboard becomes visible to animate moments
    const dashboardObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                animateMomentBars();
                dashboardObserver.disconnect();
            }
        });
    });
    
    const dashboard = document.getElementById('stage-8');
    if (dashboard) {
        dashboardObserver.observe(dashboard, { attributes: true, attributeFilter: ['class'] });
    }
});

// Live counter that updates every second
function startLiveCounter() {
    // Set your relationship start date - October 4, 2024
    const startDate = new Date('2024-10-04T00:00:00');
    
    function updateCounter() {
        const now = new Date();
        const diffMs = now - startDate;
        
        // Calculate time units
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        
        // Update DOM elements
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = days;
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }
    
    // Update immediately and then every second
    updateCounter();
    setInterval(updateCounter, 1000);
}
function nextStage() {
    const currentStageEl = document.getElementById(`stage-${currentStage}`);
    currentStageEl.classList.remove('active');
    
    currentStage++;
    
    const nextStageEl = document.getElementById(`stage-${currentStage}`);
    nextStageEl.classList.add('active');
    
    // If we're at the transition stage (now stage 7), auto-progress to dashboard
    if (currentStage === 7) {
        setTimeout(() => {
            currentStageEl.classList.remove('active');
            currentStage++;
            const dashboardEl = document.getElementById(`stage-${currentStage}`);
            dashboardEl.classList.add('active');
            // Update quiz score display
            updateQuizScore();
        }, 3500);
    }
}

// Handle quiz answer selection
function selectQuizAnswer(questionNum, answer, isCorrect) {
    // Store answer
    answers[questionNum] = { answer, isCorrect };
    
    // Update score
    if (isCorrect) {
        quizScore++;
    }
    
    // Mark selected button and disable all
    const buttons = document.querySelectorAll(`#stage-${questionNum} .option-btn`);
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.classList.remove('selected');
    });
    
    event.target.classList.add(isCorrect ? 'correct' : 'wrong');
    
    // Show response
    const revealEl = document.getElementById(`reveal-${questionNum}`);
    const response = getQuizResponse(questionNum, isCorrect);
    
    revealEl.innerHTML = `
        <p style="font-size: 3rem; margin-bottom: 1rem;">${response.emoji}</p>
        <p>${response.text}</p>
        <button class="continue-btn" onclick="nextStage()">Continue ♡</button>
    `;
    revealEl.classList.add('show');
}

// Get quiz responses
function getQuizResponse(questionNum, isCorrect) {
    const responses = {
        1: {
            correct: {
                emoji: '🎉',
                text: '¡Exacto! La primerita fue pizza y vino en el depa... Se puso re bueno!!'
            },
            wrong: {
                emoji: '😅',
                text: 'Chiaaale neta no sabes??  era : "🍕 Pizza & 🍷 Depa" - ¡ahí fue donde todo empezó! ♡'
            }
        },
        2: {
            correct: {
                emoji: '🚴',
                text: '¡Buena esa! Red es Canyon. Me da gusto que sepas de Red'
            },
            wrong: {
                emoji: '😄',
                text: 'Casi! Red es una Canyon, no te olvides de mi red capibara... como? ♡'
            }
        },
        3: {
            correct: {
                emoji: '🥬',
                text: '¡Ay Ay Ay! Apoco si se sabe? Laitue es lechuga en francés. ¡Sí le sabes!'
            },
            wrong: {
                emoji: '🇫🇷',
                text: 'Ijiji nope! La respuesta correcta es "Laitue" - a estudiarle pues ♡'
            }
        },
        4: {
            correct: {
                emoji: '🎉',
                text: '¡Exacto! Capibarini Cocosini tutti li bambini. Ese es el apodo completito! '
            },
            wrong: {
                emoji: '😅',
                text: 'Nooope! La respuesta correcta es: "Capibarini Cocosini tutti li bambini" - Es el apodo enterito! ♡'
            }
        },
        5: {
            correct: {
                emoji: '🎊',
                text: '¡Perfecto! Sí le sabes... Mi nombre intermedio es Pierre ♡'
            },
            wrong: {
                emoji: '😄',
                text: '¡Tssss... no le sabes! Mi nombre intermedio es Pierre, no se te vaya a olvidar'
            }
        },
        6: {
            correct: {
                emoji: '🧬',
                text: 'Woah! Sí le sabes a la bioquímica. La mayor producción de ATP ocurre en la membrana interna durante la cadena de transporte de electrones ♡'
            },
            wrong: {
                emoji: '🤓',
                text: 'Trakatelas no! Ijiji, la respuesta correcta es: "En la membrana interna, en la cadena de transporte de electrones". ¡Ahí es donde ocurre la magia del ATP! ♡'
            }
        }
    };
    
    return isCorrect ? responses[questionNum].correct : responses[questionNum].wrong;
}

// Update quiz score display in dashboard
function updateQuizScore() {
    const scoreEl = document.getElementById('quiz-score');
    const messageEl = document.getElementById('score-message');
    const emojiEl = document.getElementById('score-emoji');
    
    if (scoreEl) {
        // Animate score with a simple counter
        let current = 0;
        const duration = 1500;
        const startTime = Date.now();
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            current = Math.floor(quizScore * progress);
            scoreEl.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        animate();
        
        // Set message based on score
        let message = '';
        let emoji = '';
        
        if (quizScore === 6) {
            message = '¡Perfecto! 100% - El capibarini siiiii le sabe ♡';
            emoji = '🏆';
        } else if (quizScore === 5) {
            message = '¡Buueena! Casi perfecto capibarini... pero te fallo una ♡';
            emoji = '⭐';
        } else if (quizScore === 4) {
            message = '¡Bien! Medio que si le sabes ♡';
            emoji = '💫';
        } else if (quizScore === 3) {
            message = '¡No está mal! A la mitad pero podria ser mejor♡';
            emoji = '💪';
        } else if (quizScore === 2) {
            message = 'Hay que hacer un gran repaso mano...  ♡';
            emoji = '📚';
        } else if (quizScore === 1) {
            message = 'Jeje, lamento decirte que no le sabes...hay que estudiarle';
            emoji = '📖';
        } else {
            message = 'Bueno... al menos lo intentaste Capibara ♡';
            emoji = '😅';
        }
        
        messageEl.textContent = message;
        emojiEl.textContent = emoji;
    }
}

// Get personalized responses
function getResponse(questionNum, answer) {
    const responses = {
        1: {
            'yes': {
                text: "I remember it too. Every detail. The way you smiled, the way time seemed to slow down... it was the beginning of everything. ♡"
            },
            'fuzzy': {
                text: "Let me help you remember: nervous smiles, stolen glances, and that moment we both knew something special was starting. ♡"
            },
            'no': {
                text: "It was magical. We talked for hours like we'd known each other forever. From that day on, I knew you were someone extraordinary. ♡"
            }
        },
        2: {
            'adventure': {
                text: "Our adventures are my favorite too! Every trip, every spontaneous decision - they're all perfect because I'm with you. ♡"
            },
            'quiet': {
                text: "Those quiet moments mean everything to me too. Just us, no distractions, perfectly content in each other's company. ♡"
            },
            'laughs': {
                text: "Your laugh is my favorite sound in the world. Those moments when we can't stop laughing are pure magic. ♡"
            },
            'all': {
                text: "Exactly! Every single moment with you is a favorite. The big adventures and the quiet nights - I treasure them all. ♡"
            }
        },
        3: {
            'beach': {
                text: "A beach sunset sounds perfect. Just imagine: golden hour, ocean waves, and us. Someday soon, let's make it happen. ♡"
            },
            'city': {
                text: "City lights at night have a special magic, don't they? Getting lost in a new city together sounds like a dream. ♡"
            },
            'mountains': {
                text: "Mountains and you - the perfect combination. Fresh air, stunning views, and my favorite person. Let's plan it! ♡"
            },
            'couch': {
                text: "Honestly? Sometimes the couch is the best place in the world. Because home is wherever you are. ♡"
            }
        }
    };
    
    return responses[questionNum][answer];
}

// Dinner Decider
function setupDinnerDecider() {
    const dinnerOptions = [
        "🌮 Tacos Tonight",
        "🍣 Sushi Date", 
        "🍝 Italian Vibes",
        "🍜 Thai Food",
        "🍔 Burger Time",
        "👨‍🍳 Cook Together",
        "🍕 Pizza Party",
        "🥗 Something Healthy",
        "🍱 Order In & Chill"
    ];
    
    const button = document.getElementById('decide-btn');
    const resultDisplay = document.getElementById('result-text');
    
    if (button && resultDisplay) {
        button.addEventListener('click', () => {
            // Add rolling effect
            resultDisplay.style.opacity = '0.5';
            resultDisplay.textContent = "Deciding...";
            
            // Random selection with delay
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * dinnerOptions.length);
                resultDisplay.textContent = dinnerOptions[randomIndex];
                resultDisplay.style.opacity = '1';
                resultDisplay.style.color = 'var(--accent-primary)';
                resultDisplay.style.fontWeight = '700';
                resultDisplay.style.fontSize = '1.2rem';
                
                // Add a little celebration animation
                resultDisplay.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    resultDisplay.style.transform = 'scale(1)';
                }, 300);
            }, 800);
        });
    }
}

// Add some sparkle effects on hover (optional enhancement)
document.addEventListener('DOMContentLoaded', () => {
    const bentoCards = document.querySelectorAll('.bento-card');
    
    bentoCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.3s ease';
        });
    });
});

// Optional: Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && currentStage < 4) {
        const continueBtn = document.querySelector(`#stage-${currentStage} .continue-btn`);
        if (continueBtn) {
            continueBtn.click();
        }
    }
});

// Poll functionality
let pollVoted = false;

function votePoll(choice) {
    if (pollVoted) return; // Prevent multiple votes
    
    pollVoted = true;
    
    // Pre-existing votes (your vote for Yosemite = 50%)
    const preVotes = {
        yosemite: 1,
        canada: 0,
        mexico: 0
    };
    
    // Add the user's vote
    const votes = { ...preVotes };
    votes[choice] += 1;
    
    // Calculate totals and percentages
    const totalVotes = votes.yosemite + votes.canada + votes.mexico;
    const percentages = {
        yosemite: (votes.yosemite / totalVotes * 100).toFixed(0),
        canada: (votes.canada / totalVotes * 100).toFixed(0),
        mexico: (votes.mexico / totalVotes * 100).toFixed(0)
    };
    
    // Disable all buttons
    const buttons = document.querySelectorAll('.poll-option');
    buttons.forEach(btn => btn.disabled = true);
    
    // Reveal bars and percentages with animation
    setTimeout(() => {
        // Show bar containers
        document.querySelectorAll('.poll-bar-container').forEach(container => {
            container.classList.add('visible');
        });
        
        // Animate bars to their percentages
        Object.keys(percentages).forEach(option => {
            const bar = document.querySelector(`.poll-bar[data-option="${option}"]`);
            const percentageEl = document.querySelector(`[data-percentage="${option}"]`);
            
            if (bar && percentageEl) {
                setTimeout(() => {
                    bar.style.width = `${percentages[option]}%`;
                    percentageEl.textContent = `${percentages[option]}%`;
                    percentageEl.classList.add('visible');
                }, 100);
            }
        });
        
        // Highlight winner
        setTimeout(() => {
            const winnerOption = Object.keys(percentages).reduce((a, b) => 
                percentages[a] > percentages[b] ? a : b
            );
            
            const winnerButton = document.querySelector(`[onclick="votePoll('${winnerOption}')"]`);
            if (winnerButton) {
                winnerButton.classList.add('winner');
            }
            
            // Update message
            const messageEl = document.getElementById('poll-message');
            if (messageEl) {
                messageEl.classList.add('revealed');
                
                if (choice === 'yosemite') {
                    messageEl.innerHTML = '🎉 Cool! ¡Yosemite! Se arma ya tengo algo planeado con fabio... ♡';
                } else if (choice === 'canada') {
                    messageEl.innerHTML = '🍁 Canada esta cool pero para la prox... se esta cocinando algo en SF!♡';
                } else {
                    messageEl.innerHTML = '🌮 México siempre es buena idea, la neta si jalo... ';
                }
            }
        }, 1600);
    }, 300);
}

// Scratch Card functionality
function initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('scratch-card');
    
    // Set canvas size to match container
    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Fill canvas with scratch-off layer
        ctx.fillStyle = '#c9184a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add pattern/texture
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < canvas.width; i += 20) {
            for (let j = 0; j < canvas.height; j += 20) {
                ctx.fillStyle = i % 40 === 0 ? '#800f2f' : '#c9184a';
                ctx.fillRect(i, j, 10, 10);
            }
        }
        ctx.globalAlpha = 1;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    let isScratching = false;
    let scratchedPercentage = 0;
    
    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        if (e.touches && e.touches[0]) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            };
        }
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }
    
    function scratch(x, y) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Check scratched percentage
        checkScratchProgress();
    }
    
    function checkScratchProgress() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparent = 0;
        
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] < 128) transparent++;
        }
        
        scratchedPercentage = (transparent / (pixels.length / 4)) * 100;
        
        // If more than 60% scratched, reveal completely
        if (scratchedPercentage > 60) {
            revealComplete();
        }
    }
    
    function revealComplete() {
        canvas.style.transition = 'opacity 0.5s ease';
        canvas.style.opacity = '0';
        setTimeout(() => {
            canvas.style.display = 'none';
        }, 500);
    }
    
    // Mouse events
    canvas.addEventListener('mousedown', (e) => {
        isScratching = true;
        const pos = getMousePos(e);
        scratch(pos.x, pos.y);
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (!isScratching) return;
        const pos = getMousePos(e);
        scratch(pos.x, pos.y);
    });
    
    canvas.addEventListener('mouseup', () => {
        isScratching = false;
    });
    
    canvas.addEventListener('mouseleave', () => {
        isScratching = false;
    });
    
    // Touch events
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isScratching = true;
        const pos = getMousePos(e);
        scratch(pos.x, pos.y);
    }, { passive: false });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isScratching) return;
        const pos = getMousePos(e);
        scratch(pos.x, pos.y);
    }, { passive: false });
    
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        isScratching = false;
    }, { passive: false });
}

// Animate moment bars
function animateMomentBars() {
    const bars = document.querySelectorAll('.moment-bar[data-count]');
    const maxCount = 100; // Maximum for scale (you can adjust this)
    
    bars.forEach((bar, index) => {
        const count = parseInt(bar.getAttribute('data-count'));
        const percentage = Math.min((count / maxCount) * 100, 100);
        
        setTimeout(() => {
            bar.style.width = `${percentage}%`;
        }, index * 200); // Stagger animation
    });
}
