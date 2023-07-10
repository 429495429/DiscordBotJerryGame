const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
} = require('discord.js');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    // devOnly: Boolean,
    // testOnly: true,
    
    name: '捅0鱼pg',
    description: '你想捅几下',
    options: [
        {
            name: 'times',
            description: 'number of times',
            type: ApplicationCommandOptionType.Number,
            require: true,
        }
    ],

    callback: async (client, interaction) => {
        const num = interaction.options.get('times').value;
        await interaction.reply(`${interaction.member}捅了0鱼pg${num}下!`);
        if(num<=5){
            await delay(num*1000);
            await interaction.followUp(`0鱼: 才${num}下就不行了，杂鱼❤~杂鱼❤~`);
        } else if(num>5 && num<=10){
            await delay(num*1000);
            await interaction.followUp(`0鱼: 区区${interaction.member}居然捅了${num}下，杂, 杂鱼❤~`);
        } else if(num>10 && num<=15){
            await delay(num*1000);
            await interaction.followUp(`0鱼: 呀啊啊啊，要，要融化了❤~`);
        } else {
            await delay(num*1000);
            await interaction.followUp(`0鱼: 不，不可以❤，要死❤，要死❤，要被${interaction.member}弄坏掉啦❤~`);
        }
    },
};