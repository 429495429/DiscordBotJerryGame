const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (exceptions) => {
    let localCommands = [];

    const commandCategories = getAllFiles(path.join(__dirname, '..', 'commands'), true);

    for (const commandCategorie of commandCategories) {
        const commandFiles = getAllFiles(commandCategorie);

        for (const commandFile of commandFiles){
            const commandObject = require(commandFile);
            localCommands.push(commandObject);
        }
    }

    return localCommands;
}