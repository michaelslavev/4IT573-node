const guessTheNumberGame = () => {
    const randomNumber = Math.floor(Math.random() * 10) + 1;

    const maxAttempts = 5;
    let attempts = 0;

    while (attempts < maxAttempts) {
        const userGuess = prompt(`Zadejte číslo mezi 1 a 10 (pokus ${attempts + 1} z ${maxAttempts}):`);
        const guessedNumber = parseInt(userGuess);

        if (!guessedNumber || guessedNumber < 1 || guessedNumber > 10) {
            alert('Prosím, zadejte platné číslo mezi 1 a 10.');
            continue;
        }

        if (guessedNumber === randomNumber) {
            alert('Gratuluji, uhodli jste správně! Vyhráli jste.');
            break;
        } else {
            alert('Bohužel, to nebylo správné číslo.');
        }

        attempts++;
    }

    if (attempts >= maxAttempts) {
        alert(`Bohužel, vaše pokusy jsou u konce. Správné číslo bylo ${randomNumber}.`);
    }
}

guessTheNumberGame()

