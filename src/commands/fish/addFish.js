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
        name: 'rare',
        description: 'The rarelity of the fish',
        type: ApplicationCommandOptionType.Number,
        choices: [
            {
                name: 'common',
                value: 1,
            },
            {
                name: 'superior',
                value: 2,
            },
            {
                name: 'luxurious',
                value: 3,
            },
            {
                name: 'mythic',
                value: 4,
            },
            {
                name: '#$%^@□',
                value: 5,
            },
        ],
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
            const ft = await interaction.options.get('fishtype').value;
            const fn = await interaction.options.get('fishname').value;
            var mal = await interaction.options.get('maxlength').value;
            var mil = await interaction.options.get('minlength').value;
            const rare = await interaction.options.get('rare').value;
            const up = await interaction.options.get('unitprice').value;
            const roleId = '1127423063441547425';
            const roleMention = `<@&${roleId}>`;
            if (mil > mal){
                var temp = mil;
                mil = mal;
                mal = temp;
            }

            try {
                const query = {
                    fishname: fn
                };

                const afishtype = await FishType.findOne(query);

                if (afishtype) {
                    
                    afishtype.fishtype = ft;
                    afishtype.maxlength = mal;
                    afishtype.minlength = mil;
                    afishtype.rare = rare;
                    afishtype.unitprice = up;

                    await afishtype.save().catch((e) => {
                        console.log(`Error saving updated fisher data ${e}`);
                        return;
                    });
                    
                } else {
                    const newfishtype = new FishType({
                        fishtype: ft,
                        fishname: fn,
                        maxlength: mal,
                        minlength: mil,
                        rare: rare,
                        unitprice: up,
                    });

                    await newfishtype.save();
                }
                
                var raretext;
                switch (rare) {
                    case 1:
                        raretext = "common";
                        break;
                    case 2:
                        raretext = "superior";
                        break;
                    case 3:
                        raretext = "luxurious";
                        break;
                    case 4:
                        raretext = "mythic";
                        break;
                    case 5:
                        raretext = "#$%^@□";
                        break;
                    default:
                        break;
                }
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
                        name: 'rarity: ',
                        value: `${raretext}`,
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

            
            await interaction.reply("upload success");
            await interaction.channel.send({ embeds: [embed] });
                             
            } catch (error) {
                console.log(error);
            }
        } else {
            return;
        }
    },
};