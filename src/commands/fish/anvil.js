const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    AttachmentBuilder,
    EmbedBuilder,
  } = require('discord.js');
const Fisher = require('../../model/fisher');
const Rod = require('../../model/rod');
const RodType = require('../../model/rodType');
const Equipship = require('../../model/equipship');
const { Types } = require('mongoose');

function getRandom(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max-min + 1) + min);
}

module.exports = {
    deleted: false,
    name: 'anvil',
    description: 'Reinforce the rod!',
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
        if(!interaction.options.get('rodid')) {
            interaction.reply('Please enter the id of the rod');
            return;
        }
            
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

                //check if the user have already equip this rod
                const equipshipquery = {
                    rodId:rod._id
                };
                const equipship = await Equipship.findOne(equipshipquery);
                if(equipship){
                    interaction.reply("Please put off your rod first.");
                    return;
                }
                
                //calculate the cost of this reinforcement
                const reinforcelevel = rod.reinforce;
                var reinforcecost;
                if(reinforcelevel < 3){
                    reinforcecost =  reinforcelevel + 1;
                    reinforcecost *= 1000;
                } else if(reinforcelevel < 6){
                    reinforcecost =  reinforcelevel + 1;
                    reinforcecost *= 6000;
                } else if(reinforcelevel < 9){
                    reinforcecost =  reinforcelevel + 1;
                    reinforcecost *= 20000;
                } else {
                    reinforcecost =  reinforcelevel + 1;
                    reinforcecost *= 100000;
                }
                if(fisher.cash < reinforcecost){
                    interaction.reply(`You need ${reinforcecost} cash to reinforce your rod + ${rod.reinforce} ${rod.rodname}`);
                    return;
                }
                fisher.cash -= reinforcecost;
                await fisher.save().catch((e) => {
                    console.log(`Error saving updated fisher data ${e}`);
                    return;
                });

                //calculate the cost of this reinforcement
                var resulttext;
                var oldrodtime = rod.basictime;
                var suc = getRandom(1,12);
                if(suc > reinforcelevel){
                    resulttext = "Congradulation, you succeed on reinforcing!";
                    rod.reinforce ++;
                    rod.basictime = Math.floor(rod.basictime*0.93);
                    await rod.save().catch((e) => {
                        console.log(`Error saving updated fisher data ${e}`);
                        return;
                    });

                }else{
                    resulttext = "Poo~ Failed~";
                    console.log(reinforcelevel - suc);
                    if((reinforcelevel - suc) > 4){
                        resulttext = "Oh No! Something works even worse!";
                        rod.reinforce --;
                        rod.basictime = Math.floor(rod.basictime/0.93);
                        await rod.save().catch((e) => {
                            console.log(`Error saving updated fisher data ${e}`);
                            return;
                        });
                    } else if((reinforcelevel - suc) > 8){
                        resulttext = "Victory and defeat is a common thing in the army. Please start from the beginning.";
                        rod.reinforce = 0;
                        const rodtype = RodType.findOne({ rodname:rod.rodname });
                        rod.basictime = rodtype.basictime;
                        await rod.save().catch((e) => {
                            console.log(`Error saving updated fisher data ${e}`);
                            return;
                        });
                    }
                }
                

                //create visualized embed of equipship
                const embed = new EmbedBuilder()
                    .setTitle('Reinforcing Rod')
                    .setDescription('detail')
                    .setColor('FFFFFF')
                    .addFields(
                        {
                            name: `${resulttext}`,
                            value: ` `
                        },
                        {
                            name: 'Name:',
                            value: `+ ${reinforcelevel} ${rod.rodname}`
                        },
                        {
                            name: 'Fishtime:',
                            value: `${oldrodtime/1000} seconds`
                        },
                        {
                            name: 'After Reinforce:',
                            value: `+ ${rod.reinforce} ${rod.rodname}`
                        },
                        {
                            name: 'Fishtime:',
                            value: `${rod.basictime/1000} seconds`
                        },
                    )
                    .setFooter({ text:`Rod Reinforce`});

                await interaction.reply({ embeds: [embed] });

            } else {
                await interaction.reply('You have not signin as a fisher yet!');
            }
            
            
        } catch (error) {
            console.log(error);
        }
    },
};