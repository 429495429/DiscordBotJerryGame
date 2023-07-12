const Fisher = require('../../model/fisher');
const { lureUnitCost } = require('../../../config.json');
const {
    ApplicationCommandOptionType,
    EmbedBuilder,
} = require('discord.js');


module.exports = {
    deleted: false,
    name: 'buylure',
    description: 'buy a number of lures cost 20/lure',
    // devOnly: Boolean,
    // testOnly: true,
    options: [
        {
            name: 'amount',
            description: 'the amount of lures you wanna buy',
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ],
    
    callback: async (client, interaction) => {
        if(!interaction.inGuild() || interaction.user.bot ) return;
        
        const lureToGive = interaction.options.get('amount').value;
        var lureCost = lureToGive*lureUnitCost;
        
        const query = {
            userId: interaction.member.user.id,
            guildId: interaction.guild.id
        };
        try {
            const fisher = await Fisher.findOne(query);

            if(fisher){
                if(fisher.cash < lureCost){
                    await interaction.reply(`You need ${lureCost} cash for it`);
                    return;
                }
                fisher.lure += lureToGive;
                fisher.cash -= lureCost;
                await fisher.save().catch((e) => {
                    console.log(`Error saving updated fisher data ${e}`);
                    return;
                });
            } else {
                await interaction.reply('You are not a fisher yet');
            }
            await interaction.reply(`${interaction.member} has bought ${lureToGive} lures.`);
            
        } catch (error) {
            console.log(error);
        }
        
        
    },
};