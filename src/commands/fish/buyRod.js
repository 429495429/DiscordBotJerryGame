const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    AttachmentBuilder,
    EmbedBuilder,
  } = require('discord.js');
const Fisher = require('../../model/fisher');
const RodType = require('../../model/rodType');
const Rod = require('../../model/rod');
const { Types } = require('mongoose');

module.exports = {
    deleted: false,
    name: 'buyrod',
    description: 'buy a rod with name',
    // devOnly: Boolean,
    // testOnly: true,
    options: [
        {
            name: 'rodname',
            description: 'The type of the fish.',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    
    callback: async (client, interaction) => {
        if(!interaction.inGuild() || interaction.user.bot ) return;
        if(!interaction.options.get('rodname')){
            interaction.reply({content: 'please enter the rod name', ephemeral: true });
            return;
        }
        
        const query = {
            userId: interaction.member.user.id,
            guildId: interaction.guild.id
        };
        try {
            const fisher = await Fisher.findOne(query);
            const rodname = interaction.options.get('rodname').value;
            // const fishId = new Types.ObjectId(fishid);

            //check if the user is alreayd signin as fisher
            if(fisher){
                const rodtypequery = {
                    rodname: rodname
                };

                //feching the rodtype
                const rodtype = await RodType.findOne(rodtypequery);

                //determine if the rodtype exist and if is is selling 
                if(!rodtype){
                    await interaction.reply('This rod does not exist.');
                    return;
                }
                if(rodtype.limited){
                    await interaction.reply('This rod are not selling now.');
                    return;
                }
                

                //calculated the cash that fisher need to pay and check if they have
                var pay = rodtype.shopcost;
                if(fisher.cash < pay){
                    await interaction.reply(`You need ${pay} cash for it`);
                    return;
                }

                //get the pay from the fisher
                fisher.cash -= pay;
                await fisher.save().catch((e) => {
                    console.log(`Error saving updated fisher data ${e}`);
                    return;
                });

                //create the rod object
                const newrod = new Rod({
                    rodname:rodtype.rodname,
                    rare0rate:rodtype.rare0rate,
                    rare1rate:rodtype.rare1rate,
                    rare2rate:rodtype.rare2rate,
                    rare3rate:rodtype.rare3rate,
                    rare4rate:rodtype.rare4rate,
                    rare5rate:rodtype.rare5rate,
                    basictime:rodtype.basictime,
                    sellprice:pay,
                    ownerId:fisher.userId,
                    reinforce:0,
                });
                await newrod.save();

                //create visualized embed of fish basket
                const embed = new EmbedBuilder()
                    .setTitle('Your new Rod')
                    .setDescription('detail')
                    .setColor('FFFFFF')
                    .addFields(
                        {
                            name: 'Name:',
                            value: `+ ${newrod.reinforce} ${newrod.rodname}`
                        },
                        {
                            name: 'Cost:',
                            value: `${pay}`
                        },
                        {
                            name: 'Scale:',
                            value: `${newrod.rare0rate}-${newrod.rare1rate}-${newrod.rare2rate}-${newrod.rare3rate}-${newrod.rare4rate}-${newrod.rare5rate}`
                        },
                        {
                            name: 'Fishtime:',
                            value: `${newrod.basictime/1000} seconds`
                        },
                    )
                    .setFooter({ text:`Rod Bought`});

                await interaction.reply({ embeds: [embed] });

            }else {
                await interaction.reply('You have not signin as a fisher yet!');
            }
            
            
        } catch (error) {
            console.log(error);
        }
    },
};