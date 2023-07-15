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
    name: 'equip',
    description: 'Equip a Rod!',
    // devOnly: Boolean,
    // testOnly: true,
    options: [
        {
            name: 'rodid',
            description: 'The id of the rod.',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    
    callback: async (client, interaction) => {
        if(!interaction.inGuild() || interaction.user.bot ) return;
        if(!interaction.options.get('rodid')) return;
            
        const query = {
            userId: interaction.member.user.id,
            guildId: interaction.guild.id
        };
        try {
            const fisher = await Fisher.findOne(query);
            const rodid = interaction.options.get('rodid').value;
            const rodId = new Types.ObjectId(rodid);

            //check if the user is alreayd signin as fisher
            if(fisher){

                
                const rodsquery = {
                    _id:rodId,
                    ownerId:interaction.member.user.id
                };

                //feching the target rod owned by this fisher
                const rod = await Rod.findOne(rodsquery);

                //check if user have that rod
                if(!rod){
                    interaction.reply("This is not an id of your rods");
                    return;
                }

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

                //creating object equipship
                const newequipship = new Equipship({
                    ownerId:fisher.userId,
                    rodId:rod._id
                });
                await newequipship.save();
                

                //create visualized embed of equipship
                const embed = new EmbedBuilder()
                    .setTitle('Equiping Rod')
                    .setDescription('detail')
                    .setColor('FFFFFF')
                    .addFields(
                        {
                            name: 'Name:',
                            value: `+ ${rod.reinforce} ${rod.rodname}`
                        },
                        {
                            name: 'Scale:',
                            value: `${rod.rare0rate}-${rod.rare1rate}-${rod.rare2rate}-${rod.rare3rate}-${rod.rare4rate}-${rod.rare5rate}`
                        },
                        {
                            name: 'Fishtime:',
                            value: `${rod.basictime/1000} seconds`
                        },
                    )
                    .setFooter({ text:`Rod Equip`});

                await interaction.reply({ embeds: [embed] });

            } else {
                await interaction.reply('You have not signin as a fisher yet!');
            }
            
            
        } catch (error) {
            console.log(error);
        }
    },
};