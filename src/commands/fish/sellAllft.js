const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    AttachmentBuilder,
    EmbedBuilder,
  } = require('discord.js');
const Fisher = require('../../model/fisher');
const Fish = require('../../model/fish');
const { Types } = require('mongoose');

module.exports = {
    deleted: false,
    name: 'sellallft',
    description: 'sell fish with fish name',
    // devOnly: Boolean,
    // testOnly: true,
    options: [
        {
            name: 'fishname',
            description: 'The species of the fish.',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    
    callback: async (client, interaction) => {
        if(!interaction.inGuild() || interaction.user.bot ) return;
        
        const query = {
            userId: interaction.member.user.id,
            guildId: interaction.guild.id
        };
        try {
            const fisher = await Fisher.findOne(query);
            const fishName = interaction.options.get('fishname').value;

            //check if the user is alreayd signin as fisher
            if(fisher){
                const fishquery = {
                    fishname: fishName,
                    ownerId:fisher.userId
                };

                //feching the fish
                const fishlist = await Fish.find(fishquery);

                //determine if the fish owned by this fisher
                if(!fishlist){
                    await interaction.reply('You dont have that type of fish');
                    return;
                }

                //calculated the cash that fisher can get
                var pay = 0;
                fishlist.forEach(fish =>{
                    pay += fish.price;
                });
                const fishAmount = fishlist.length;

                //add payments to fisher's cash and deletethe fish
                fisher.cash += pay;
                await fisher.save().catch((e) => {
                    console.log(`Error saving updated fisher data ${e}`);
                    return;
                });
                Fish.deleteMany(fishquery).catch((e) => {
                    console.log(`Error deleting fish data ${e}`);
                    return;
                });

                //create visualized embed of fish basket
                const embed = new EmbedBuilder()
                    .setTitle('Selling result')
                    .setDescription('detail')
                    .setColor('FFFFFF')
                    .addFields(
                        {
                            name: 'You have sold: ',
                            value: `${fishAmount} ${fishName}`
                        },
                        {
                            name: 'Total Earn: ',
                            value: `${pay}`
                        },
                    )
                    .setFooter({ text:`Fish sold`});

                await interaction.reply({ embeds: [embed] });

            }else {
                await interaction.reply('You have not signin as a fisher yet!');
            }
            
            
        } catch (error) {
            console.log(error);
        }
    },
};