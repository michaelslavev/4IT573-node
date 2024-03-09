import { createServer } from 'http';
import { promises as fs } from 'fs';

const SERVER_PORT = 3000;
const COUNTER_FILENAME = 'counter.txt';

const ensureFileExists = async () => {
    try {
        const data = await fs.readFile(COUNTER_FILENAME, 'utf8');
        return parseInt(data, 10);
    } catch (error) {
        await fs.writeFile(COUNTER_FILENAME, '0', 'utf8');
        return 0;
    }
}

const updateCounter = async (change) => {
    try {
        let currentNumber = await ensureFileExists();
        currentNumber += change;

        await fs.writeFile(COUNTER_FILENAME, currentNumber.toString(), 'utf8');

        return currentNumber;
    } catch (error) {
        throw new Error('Error updating counter: ' + error.message);
    }
}

const readCounter = async () => {
    try {
        return await ensureFileExists();
    } catch (error) {
        throw new Error('Error reading counter: ' + error.message);
    }
}


const server = createServer(async (req, res) => {
    try {
        switch (req.url) {
            case '/increase':
                await updateCounter(1);
                res.end('OK');
                break;
            case '/decrease':
                await updateCounter(-1);
                res.end('OK');
                break;
            case '/read':
                const counter = await readCounter();
                res.end(counter.toString());
                break;
            default:
                res.statusCode = 404;
                res.end('Sorry bro, no bueno.');
        }
    } catch (error) {
        res.statusCode = 500;
        res.end('Server error');
    }
});


server.listen(SERVER_PORT, () => {
    console.log(`Server is running on http://localhost:${SERVER_PORT}`);
});
