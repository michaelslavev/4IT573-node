import { promises as fs } from 'fs';

const parseInstructionFile = async (instructionsPath) => {
    let instructions;
    try {
        instructions = await fs.readFile(instructionsPath, 'utf-8');
    } catch (error) {
        throw new Error(`Nelze načíst soubor s instrukcemi '${instructionsPath}': ${error.message}`);
    }

    try {
        const [sourceFile, destinationFile] = instructions.split(' ');
        if (!sourceFile || !destinationFile) {
            throw new Error("Soubor s instrukcemi neobsahuje správný formát.");
        }
        return { sourceFile, destinationFile };
    } catch (error) {
        throw new Error(`Chyba při parsování instrukcí: ${error.message}`);
    }
}

const copyContent = async(sourceFile, destinationFile) => {
    try {
        await fs.access(sourceFile);
    } catch (error) {
        throw new Error(`Zdrojový soubor '${sourceFile}' neexistuje.`);
    }

    const content = await fs.readFile(sourceFile, 'utf-8');
    await fs.writeFile(destinationFile, content);
}

const main = async () => {
    try {
        const {sourceFile, destinationFile} = await parseInstructionFile('instrukce.txt');
        await copyContent(sourceFile, destinationFile);
        console.log(`Data byla úspěšně zkopírována z '${sourceFile}' do '${destinationFile}'.`);
    } catch (error) {
        console.error('Chyba:', error.message);
    }
}

await main();
