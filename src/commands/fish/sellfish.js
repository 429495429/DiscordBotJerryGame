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
    name: 'sellfish',
    description: 'sell fish with id',
    // devOnly: Boolean,
    // testOnly: true,
    options: [
        {
            name: 'fishid',
            description: 'The id of the fish.',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    
    callback: async (client, interaction) => {
        if(!interaction.inGuild() || interaction.user.bot ) return;
        if(!interaction.options.get('fishid')){
            interaction.reply({content: 'please enter the fish id', ephemeral: true });
            return;
        }
        
        const query = {
            userId: interaction.member.user.id,
            guildId: interaction.guild.id
        };
        try {
            const fisher = await Fisher.findOne(query);
            const fishid = interaction.options.get('fishid').value;
            const fishId = new Types.ObjectId(fishid);

            //check if the user is alreayd signin as fisher
            if(fisher){
                const fishquery = {
                    _id: fishId,
                    ownerId:fisher.userId
                };

                //feching the fish
                const fish = await Fish.findOne(fishquery);

                //determine if the fish owned by this fisher
                if(!fish){
                    await interaction.reply('You dont have that fish');
                    return;
                }

                //calculated the cash that fisher can get
                var pay = fish.price;

                //add payments to fisher's cash and deletethe fish
                fisher.cash += pay;
                await fisher.save().catch((e) => {
                    console.log(`Error saving updated fisher data ${e}`);
                    return;
                });
                await Fish.deleteOne(fishquery).catch((e) => {
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
                            name: 'fish name',
                            value: fish.fishname
                        },
                        {
                            name: 'price',
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