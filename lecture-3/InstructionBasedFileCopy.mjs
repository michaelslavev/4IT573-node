import { promises as fs } from 'fs';

const parseInstructionFile = async (instructionsPath) => {
    let instructions;
    try {
        instructions = await fs.readFile(instructionsPath, 'utf-8');
    } catch (error) {
        throw new Error(`Nelze načíst soubor s instrukcemi '${instructionsPath}': ${error.message}`);
    }

    try {
        const number = parseInt(instructions.trim(), 10);
        if (!number) {
            throw new Error("Obsah souboru není číslo.");
        }
        return number;
    } catch (error) {
        throw new Error(`Nelze načíst soubor '${instructionsPath}': ${error.message}`);
    }
}

const createFiles = async (number) => {
    const fileCreationPromises = [];
    for (let i = 0; i < number; i++) {
        const fileName = `${i}.txt`;
        const fileContent = `Soubor ${i}`;
        const filePromise = fs.writeFile(fileName, fileContent)
            .catch(error => console.error(`Nastal problém při vytváření souboru ${i}.txt: ${error}`));

        fileCreationPromises.push(filePromise);
    }
    await Promise.all(fileCreationPromises);
}

const main = async () => {
    try {
        const instructionsPath = 'instrukce.txt';
        const numberOfFiles = await parseInstructionFile(instructionsPath);
        await createFiles(numberOfFiles);
        console.log(`Bylo úspěšně vytvořeno ${numberOfFiles} souborů.`);
    } catch (error) {
        console.error('Chyba:', error.message);
    }
}

await main();
