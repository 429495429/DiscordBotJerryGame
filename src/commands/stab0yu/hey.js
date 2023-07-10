module.exports = {
    name: 'hey',
    description: 'repley to Hey!',
    // devOnly: Boolean,
    // testOnly: true,
    
    callback: (client, interaction) => {
        interaction.reply(`Hey ${interaction.member}!`);
    },
};