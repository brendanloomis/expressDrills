const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/sum', (req, res) => {
    const a = req.query.a;
    const b = req.query.b;

    if(!a) {
        return res.status(400).send('a is required');
    }

    if(!b) {
        return res.status(400).send('b is required');
    }

    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if(Number.isNaN(numA)) {
        return res.status(400).send('a needs to be a number');
    }

    if(Number.isNaN(numB)) {
        return res.status(400).send('b needs to be a number');
    }

    const c = numA + numB;

    const sum = `The sum of ${numA} + ${numB} = ${c}`;

    res.status(200).send(sum);
});

app.get('/cipher', (req, res) => {
    const text = req.query.text;
    const shift = req.query.shift;

    if(!text) {
        res.status(400).send('text is required');
    }

    if(!shift) {
        res.status(400).send('shift is required');
    }

    const numShift = parseInt(shift);

    if(Number.isNaN(numShift)) {
        res.status(400).send('shift needs to be a number');
    }

    const base = 'A'.charCodeAt(0);

    const cipher = text.toUpperCase().split('').map(char => {
        const code = char.charCodeAt(0);

        if(code < base || code > (base + 26)) {
            return char;
        }

        let diff = code - base;
        diff = diff + numShift;
        diff = diff % 26;

        const shiftedChar = String.fromCharCode(base + diff);
        return shiftedChar;
    }).join('');

    res.status(200).send(cipher);
});

app.get('/lotto', (req, res) => {
    const numbers = req.query.numbers;

    if(!numbers) {
        return res.status(400).send('numbers is required');
    }

    if(!Array.isArray(numbers)) {
        return res.status(400).send('numbers needs to be an array');
    }

    const numbersInput = numbers.map(n => parseInt(n)).filter(n => !Number.isNaN(n) && (n >= 1 || n <= 20));

    if(numbersInput.length != 6) {
        return res.status(400).send('numbers needs to contain 6 integers between 1 and 20');
    }

    const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);

    const winningNumbers = [];
    for (let i = 0; i < 6; i++) {
        const random = Math.floor(Math.random() * stockNumbers.length);
        winningNumbers.push(stockNumbers[random]);
        stockNumbers.splice(random, 1);
    }

    let diff = winningNumbers.filter(n => !numbersInput.includes(n));

    let responseText;

    if (diff.length === 0) {
        responseText = 'Wow! Unbelievable! You could have won the mega millions!';
    } else if (diff.length === 1) {
        responseText = 'Congratulations! You win $100';
    } else if (diff.length === 2) {
        responseText = 'Congratulations, you win a free ticket';
    } else {
        responseText = 'Sorry, you lose';
    }

    res.status(200).send(responseText);
})

app.listen(8000, () => {
    console.log('Express server is listening on port 8000');
});