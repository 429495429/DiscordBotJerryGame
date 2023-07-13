const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    AttachmentBuilder,
    EmbedBuilder,
  } = require('discord.js');
const Fisher = require('../../model/fisher');
const RodType = require('../../model/rodType');

module.exports = {
    deleted: false,
    name: 'rodshop',
    description: 'Welcome to Rod Shop!',
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
                const rodshopquery = {
                    limited: false
                };

                //feching the fish owned by this fisher
                const rodlist = await RodType.find(rodshopquery);
                const rodPerPage = 5;
                if(interaction.options.get('page')){
                    rodshopPage = interaction.options.get('page').value;
                }else{
                    rodshopPage = 1;
                }

                //calculated the page and the fish show in the page
                pageStart = (rodshopPage-1)*5;
                const rodNumber = rodlist.length;
                var showedNumber;
                totalPages = Math.ceil(rodNumber/5);
                if(rodshopPage > totalPages){
                    await interaction.reply('We dont have that many rod');
                    return;
                }
                if(totalPages == rodshopPage){
                    showedNumber = rodNumber%5;
                    if(showedNumber == 0){
                        showedNumber = 5
                    }
                }else{
                    showedNumber = 5;
                }

                //create visualized embed of fish basket
                const embed = new EmbedBuilder()
                    .setTitle(`Fisher Forge`)
                    .setDescription('list of Rod')
                    .setColor('FFFFFF')
                    .setFooter({ text:`Page ${rodshopPage} 页 / 共 ${totalPages} 页`});

                rodlist.splice(pageStart,showedNumber).forEach(rod => {
                    embed.addFields(
                        {
                            name: `${rod.rodname} discount:${rod.discount}% cost:${rod.shopcost}cash.`,
                            value: `Rod Rare Scale: ${rod.rare0rate}-${rod.rare1rate}-${rod.rare2rate}-${rod.rare3rate}-${rod.rare4rate}-${rod.rare5rate} ${rod.basictime/1000}seconds`
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