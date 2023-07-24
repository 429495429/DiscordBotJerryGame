const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    AttachmentBuilder,
    EmbedBuilder,
  } = require('discord.js');
const Fisher = require('../../model/fisher');
const Equipship = require('../../model/equipship');

module.exports = {
    deleted: false,
    name: 'castoff',
    description: 'Unequip the rod.',
    // devOnly: Boolean,
    // testOnly: true,
    
    callback: async (client, interaction) => {
        if(!interaction.inGuild() || interaction.user.bot ) return;
            
        const query = {
            userId: interaction.member.user.id,
            guildId: interaction.guild.id
        };
        try {
            const fisher = await Fisher.findOne(query);

            //check if the user is alreayd signin as fisher
            if(fisher){

                //check if the user have already equip a rod
                const equipshipquery = {
                    ownerId:fisher.userId
                };
                const oldequipship = Equipship.findOne(equipshipquery);
                if(oldequipship){
                    await Equipship.deleteMany(equipshipquery).catch((e) => {
                        console.log(`Error deleting fish data ${e}`);
                        return;
                    });
                }

                await interaction.reply("You hav already cast off your rod.");

            } else {
                await interaction.reply('You have not signin as a fisher yet!');
            }
            
            
        } catch (error) {
            console.log(error);
        }
    },
};