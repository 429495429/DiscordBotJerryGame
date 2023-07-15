const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    AttachmentBuilder,
    EmbedBuilder,
  } = require('discord.js');
const Fisher = require('../../model/fisher');
const Rod = require('../../model/rod');
const Equipship = require('../../model/equipship');
const { Types } = require('mongoose');


module.exports = {
    deleted: false,
    name: 'me',
    description: 'Self info embed',
    // devOnly: Boolean,
    // testOnly: true,
    
    callback: async (client, interaction) => {
        if(!interaction.inGuild() || interaction.user.bot ) return;
        
        let cash = 0;
        let lure = 0;
        let exp = 0;
        const query = {
            userId: interaction.member.user.id,
            guildId: interaction.guild.id
        };
        try {
            const fisher = await Fisher.findOne(query);

            if(fisher){
                cash = fisher.cash;
                lure = fisher.lure;
                exp = fisher.exp;

            } else {
                const newfisher = new Fisher({
                    userId: interaction.member.user.id,
                    guildId: interaction.guild.id
                });
                await newfisher.save();
            }

            const embed = new EmbedBuilder()
                .setTitle(`Fisher Card`)
                .setDescription(`Fisher ${interaction.member}`)
                .addFields(
                    {
                        name: 'name: ',
                        value: `${interaction.member.user.username}`,
                        inline: false
                    },
                    {
                        name: 'cash: ',
                        value: `${cash}`,
                        inline: false
                    },
                    {
                        name: 'lure: ',
                        value: `${lure}`,
                        inline: false
                    },
                    {
                        name: 'Fishes: ',
                        value: `${exp}`,
                        inline: false
                    }
                )
                .setThumbnail(interaction.member.user.displayAvatarURL({ size: 256 }))
                .setColor('00FFFF');

            //check if the fisher equiping a rod and visulized it
            const equipshipquery = {
                ownerId:interaction.member.user.id
            }
            const equipship = await Equipship.findOne(equipshipquery);
            if(equipship){
                const rodid = new Types.ObjectId(equipship.rodId);
                const rodquery = {
                    _id:rodid
                };
                
                const rod = await Rod.findOne(rodquery);

                embed.addFields({
                    name:'equiping:',
                    value:`+ ${rod.reinforce} ${rod.rodname}`
                });
            }

            await interaction.reply({ embeds: [embed] });
            
            
        } catch (error) {
            console.log(error);
        }
        
        
    },
};