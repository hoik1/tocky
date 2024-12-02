if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

const tabs = document.querySelectorAll('.tab')
const tabContent = document.querySelectorAll('.tab-content')

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContent.forEach(content => content.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// herní logika
let balance = 1000;
let bet = 10;
let probabilities = {
    '🍒': 50,
    '🚸': 50,
    '🧙‍♂️': 50
}

const symbols = ['🍒', '🚸', '🧙‍♂️']

function spinReels() {
    if (balance < bet) {
        alert('broke boi');
        return;
    }

    // odečtení sázky
    balance -= bet;
    updateBalance();

    const reelElements = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
    const interval = setInterval(() => {
        reelElements.forEach(reel => {
            reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        });
    }, 100);

    setTimeout(() => {
        clearInterval(interval);

        const reels = [];
        for (let i = 0; i < 3; i++) {
            reels.push(getRandomSymbol());
        }

        reelElements.forEach((reel, index) => {
            reel.textContent = reels[index];
        });

        if (reels[0] === reels[1] && reels[1] === reels[2]) {
            const winAmount = 5 * bet;
            balance += winAmount;
            updateBalance();
            document.getElementById('result').textContent = `Vyhrál jsi ${winAmount} Kč 🎉`;
            showVictoryEffect(reels[0]);  // Zobrazení vítězství
        } else {
            document.getElementById('result').textContent = 'Zatoč si znovu pro lepší výhru!';
        }
    }, 3000);
}

function getRandomSymbol() {
    const total = Object.values(probabilities).reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;
    for (const symbol of symbols) {
        if (rand < probabilities[symbol]) {
            return symbol;
        }
        rand -= probabilities[symbol];
    }
}

function updateBalance() {
    document.getElementById('balance').textContent = balance;
}

function setBet() {
    const newBet = parseInt(document.getElementById('bet').value);
    if (newBet > 0 && newBet <= balance) {
        bet = newBet;
        document.getElementById('current-bet').textContent = bet;
    } else {
        alert('Neplatná sázka');
    }
}

function saveSettings() {
    const cherryProb = parseInt(document.getElementById('cherry-prob').value);
    const lemonProb = parseInt(document.getElementById('lemon-prob').value);
    const watermelonProb = parseInt(document.getElementById('watermelon-prob').value);

    const total = cherryProb + lemonProb + watermelonProb;
    if (total === 100) {
        probabilities['🍒'] = cherryProb;
        probabilities['🚸'] = lemonProb;
        probabilities['🧙‍♂️'] = watermelonProb;
        alert('Pravděpodobnosti byly úspěšně aktualizovány.');
    } else {
        alert('Součet pravděpodobností musí být 100 %.');
    }
}

function updateBalanceManually() {
    const newBalance = parseInt(prompt('Zadejte novou hodnotu prostředků:'));
    if (!isNaN(newBalance) && newBalance >= 0) {
        balance = newBalance;
        updateBalance();
        alert('Prostředky byly aktualizovány.');
    } else {
        alert('Neplatná hodnota.');
    }
}

// Přidání funkce All In
document.getElementById('all-in-button').addEventListener('click', () => {
    if (balance > 0) {
        // Nastavit sázku na celkový zůstatek
        bet = balance;
        document.getElementById('current-bet').textContent = bet;

        // Zobrazit dramatické ztmavení
        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.innerHTML = `
            <h1>Vše na jednu kartu!</h1>
            <button id="continue-button">Točit!</button>
        `;
        document.body.appendChild(overlay);

        // Přechod na efekty po kliknutí na "Točit!"
        document.getElementById('continue-button').addEventListener('click', () => {
            overlay.remove();
            startSpinWithEffects();
        });

        overlay.style.display = 'flex';
    } else {
        alert('Nemáte dostatek prostředků na sázku.');
    }
});

function startSpinWithEffects() {
    const reelContainer = document.getElementById('reels');
    const reels = document.querySelectorAll('.reel');

    // Přiblížení a třesení
    reelContainer.style.transform = 'scale(2)';
    reelContainer.style.animation = 'shake 0.5s infinite';

    spinReels();

    setTimeout(() => {
        reelContainer.style.animation = 'none';
        reelContainer.style.transform = 'scale(1)';
    }, 3000);

    setTimeout(() => {
        const reelValues = Array.from(reels).map(reel => reel.textContent);

        if (reelValues[0] === reelValues[1] && reelValues[1] === reelValues[2]) {
            showVictoryEffect(reelValues[0]);
        }
    }, 3100);
}

function showVictoryEffect(symbol) {
    const overlay = document.createElement('div');
    overlay.id = 'victory-overlay';
    overlay.innerHTML = `<h1>Gratulujeme! Vyhráli jste: 5x sázku na ${symbol}</h1>`;
    document.body.appendChild(overlay);
    
    // Přehrání zvuku (můžete přidat zvuk famfáry)
    const audio = new Audio('fanfare.mp3');
    audio.play();

    setTimeout(() => {
        overlay.remove();
    }, 3000);
}

// event listenery
document.getElementById('spin-button').addEventListener('click', spinReels);
document.getElementById('set-bet').addEventListener('click', setBet);
document.getElementById('save-settings').addEventListener('click', saveSettings);
document.getElementById('balance').addEventListener('click', updateBalanceManually);
