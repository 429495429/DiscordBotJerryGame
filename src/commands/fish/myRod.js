const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    AttachmentBuilder,
    EmbedBuilder,
  } = require('discord.js');
const Fisher = require('../../model/fisher');
const Rod = require('../../model/rod');

module.exports = {
    deleted: false,
    name: 'rod',
    description: 'show your own rods',
    // devOnly: Boolean,
    // testOnly: true,
    options: [
        {
            name: 'page',
            description: 'page number of your Rod hanger',
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
                const rodsquery = {
                    ownerId:interaction.member.user.id
                };

                //feching the fish owned by this fisher
                const rodlist = await Rod.find(rodsquery);
                const rodPerPage = 5;
                if(interaction.options.get('page')){
                    basketPage = interaction.options.get('page').value;
                }else{
                    basketPage = 1;
                }

                //calculated the page and the fish show in the page
                pageStart = (basketPage-1)*5;
                const rodNumber = rodlist.length;
                var showedNumber;
                totalPages = Math.ceil(rodNumber/5);
                if(basketPage > totalPages){
                    await interaction.reply('You dont have that many fish');
                    return;
                }
                if(totalPages == basketPage){
                    showedNumber = rodNumber%5;
                    if(showedNumber == 0){
                        showedNumber = 5
                    }
                }else{
                    showedNumber = 5;
                }

                //create visualized embed of fish basket
                const embed = new EmbedBuilder()
                    .setTitle(`${interaction.member.user.id}'s Rod Hanger`)
                    .setDescription('list of your rods')
                    .setColor('FFFFFF')
                    .setFooter({ text:`Page ${basketPage} 页 / 共 ${totalPages} 页`});

                rodlist.splice(pageStart,showedNumber).forEach(rod => {
                    embed.addFields(
                        {
                            name: `+${rod.reinforce} ${rod.rodname} id:${rod._id}`,
                            value: `Scale: ${rod.rare0rate}-${rod.rare1rate}-${rod.rare2rate}-${rod.rare3rate}-${rod.rare4rate}-${rod.rare5rate} \nFishing time:${rod.basictime/1000}seconds`
                        }
                    );
                });
                
                await interaction.reply({ embeds: [embed] });

            }else {
                await interaction.reply('You have not signin as a fisher yet!');
            }
            
            
        } catch (error) {
            console.log(error);
        }
    },
};