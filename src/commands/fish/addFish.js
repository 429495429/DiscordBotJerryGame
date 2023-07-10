const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
} = require('discord.js');
const FishType = require('../../model/fishType');
  
module.exports = {
    deleted: false,
    name: 'addfish',
    description: 'Add some a new type of fish!',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
    {
        name: 'fishtype',
        description: 'The type of the fish.',
        type: ApplicationCommandOptionType.String,
        required: true,
    },
    {
        name: 'fishname',
        description: 'The name of the fish.',
        type: ApplicationCommandOptionType.String,
        required: true,
    },
    {
        name: 'maxlength',
        description: 'The max of length',
        type: ApplicationCommandOptionType.Number,
        require: true,
    },
    {
        name: 'minlength',
        description: 'The min of length',
        type: ApplicationCommandOptionType.Number,
        require: true,
    },
    {
        name: 'unitprice',
        description: 'The min of length',
        type: ApplicationCommandOptionType.Number,
        require: true,
    }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: async(client, interaction) => {
        if(interaction.member.id === interaction.guild.ownerId){
            const ft = interaction.options.get('fishtype').value;
            const fn = interaction.options.get('fishname').value;
            const mal = interaction.options.get('maxlength').value;
            const mil = interaction.options.get('minlength').value;
            const up = interaction.options.get('unitprice').value;
            const roleId = '1127423063441547425';
            const roleMention = `<@&${roleId}>`;
            try {
                const newfishtype = new FishType({
                    fishtype: ft,
                    fishname: fn,
                    maxlength: mal,
                    minlength: mil,
                    unitprice: up,
                });

                await newfishtype.save();
                
                const embed = new EmbedBuilder()
                .setTitle(`Fish Card`)
                .setDescription(`A new type of fish have been add ${roleMention}`)
                .addFields(
                    {
                        name: 'name: ',
                        value: `${fn}`,
                        inline: false
                    },
                    {
                        name: 'belongs to: ',
                        value: `${ft}`,
                        inline: false
                    },
                    {
                        name: 'length: ',
                        value: `${mil} ~ ${mal}`,
                        inline: false
                    },
                    {
                        name: 'unitprice: ',
                        value: `${up}`,
                        inline: false
                    }
                )
                .setColor('0073ff');

            

            await interaction.channel.send({ embeds: [embed] });
                             
            } catch (error) {
                console.log(error);
            }
        } else {
            return;
        }
    },
};