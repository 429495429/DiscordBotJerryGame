const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    AttachmentBuilder,
    EmbedBuilder,
  } = require('discord.js');
const Fisher = require('../../model/fisher');
const Fish = require('../../model/fish');

module.exports = {
    deleted: false,
    name: 'basket',
    description: 'show your own basket',
    // devOnly: Boolean,
    // testOnly: true,
    options: [
        {
            name: 'page',
            description: 'page number of your basket',
            type: ApplicationCommandOptionType.Number,
            default: 1,
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

            //check if the user is alreayd signin as fisher
            if(fisher){
                const fishbasketquery = {
                    ownerId:interaction.member.user.id
                };

                //feching the fish owned by this fisher
                const fishlist = await Fish.find(fishbasketquery);
                const fishPerPage = 5;
                const basketPage = interaction.options.get('page').value;

                //calculated the page and the fish show in the page
                pageStart = (basketPage-1)*5;
                const fishNumber = fishlist.length;
                var showedNumber;
                totalPages = Math.ceil(fishNumber/5);
                if(basketPage > totalPages){
                    interaction.reply('You dont have that many fish');
                    return;
                }
                if(totalPages < basketPage){
                    showedNumber = fishNumber%5;
                }else{
                    showedNumber = 5;
                }

                //create visualized embed of fish basket
                const embed = new EmbedBuilder()
                    .setTitle('对象列表')
                    .setDescription('显示对象的信息')
                    .setColor('FFFFFF')
                    .setFooter({ text:`Page ${basketPage} 页 / 共 ${totalPages} 页`});

                fishlist.splice(pageStart,showedNumber).forEach(fish => {
                    embed.addFields(
                        {
                            name: `${fish.fishname} ${fish.length}cm long worth ${fish.price} cash. `,
                            value: `fish id: ${fish._id}`
                        }
                    );
                });
                
                interaction.reply({ embeds: [embed] });

            }else {
                await interaction.reply('You have not signin as a fisher yet!');
            }
            
            
        } catch (error) {
            console.log(error);
        }
    },
};