const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
} = require('discord.js');
const RodType = require('../../model/rodType');

  
module.exports = {
    deleted: false,
    name: 'addrodtype',
    description: 'Add a new type of rod!',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
    {
        name: 'rodname',
        description: 'The type of the fish.',
        type: ApplicationCommandOptionType.String,
        required: true,
    },
    {
        name: 'rare0rate',
        description: 'rare 0 result scale.',
        type: ApplicationCommandOptionType.Number,
        default: 1,
    },
    {
        name: 'rare1rate',
        description: 'rare 1 result scale.',
        type: ApplicationCommandOptionType.Number,
        default: 1,
    },
    {
        name: 'rare2rate',
        description: 'rare 2 result scale.',
        type: ApplicationCommandOptionType.Number,
        default: 1,
    },
    {
        name: 'rare3rate',
        description: 'rare 3 result scale.',
        type: ApplicationCommandOptionType.Number,
        default: 1,
    },
    {
        name: 'rare4rate',
        description: 'rare 4 result scale.',
        type: ApplicationCommandOptionType.Number,
        default: 0,
    },
    {
        name: 'rare5rate',
        description: 'rare 5 result scale.',
        type: ApplicationCommandOptionType.Number,
        default: 0,
    },
    {
        name: 'basictime',
        description: 'the basic fishing time of this rod',
        type: ApplicationCommandOptionType.Number,
        default: 1,
    },
    {
        name: 'shopcost',
        description: 'Cost in the shop',
        type: ApplicationCommandOptionType.Number,
        require: true,
    },
    {
        name: 'discount',
        description: 'discount of the rod',
        type: ApplicationCommandOptionType.Number,
        require: true,
    },
    {
        name: 'limited',
        description: 'is the rod limited now?',
        type: ApplicationCommandOptionType.Boolean,
        require: true,
        choice: [
            {
                name: 'Yes',
                value: true,
            },
            {
                name: 'No',
                value: false,
            }
        ],
    }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: async(client, interaction) => {
        if(interaction.member.id === interaction.guild.ownerId){
            const rn = await interaction.options.get('rodname').value;
            const r0r = await interaction.options.get('rare0rate').value;
            const r1r = await interaction.options.get('rare1rate').value;
            const r2r = await interaction.options.get('rare2rate').value;
            const r3r = await interaction.options.get('rare3rate').value;
            const r4r = await interaction.options.get('rare4rate').value;
            const r5r = await interaction.options.get('rare5rate').value;
            const bsitime = await interaction.options.get('basictime').value;
            const shopcst = await interaction.options.get('shopcost').value;
            const roddis = await interaction.options.get('discount').value;
            const rodlimit = await interaction.options.get('limited').value;
            const roleId = '1127423063441547425';
            const roleMention = `<@&${roleId}>`;

            try {
                const query = {
                    rodname: rn
                };

                const arodtype = await RodType.findOne(query);

                if (arodtype) {
                    
                    arodtype.rodname = rn;
                    arodtype.rare0rate = r0r;
                    arodtype.rare1rate = r1r;
                    arodtype.rare2rate = r2r;
                    arodtype.rare3rate = r3r;
                    arodtype.rare4rate = r4r;
                    arodtype.rare5rate = r5r;
                    arodtype.basictime = bsitime;
                    arodtype.shopcost = shopcst;
                    arodtype.discount = roddis;
                    arodtype.limited = rodlimit;

                    await arodtype.save().catch((e) => {
                        console.log(`Error saving updated fisher data ${e}`);
                        return;
                    });
                    
                } else {
                    const newrodtype = new RodType({
                        rodname: rn,
                        rare0rate: r0r,
                        rare1rate: r1r,
                        rare2rate: r2r,
                        rare3rate: r3r,
                        rare4rate: r4r,
                        rare5rate: r5r,
                        basictime: bsitime,
                        shopcost: shopcst,
                        discount: roddis,
                        limited: rodlimit
                    });

                    await newrodtype.save();
                }
                
                
                const embed = new EmbedBuilder()
                .setTitle(`Rod Card`)
                .setDescription(`A new type of rod have been add ${roleMention}`)
                .addFields(
                    {
                        name: 'Name: ',
                        value: `${rn}`,
                        inline: false
                    },
                    {
                        name: 'Basic fishing time: ',
                        value: `${bsitime}`,
                        inline: false
                    },
                    {
                        name: 'rarity scale: ',
                        value: `${r0r}-${r1r}-${r2r}-${r3r}-${r4r}-${r5r}`,
                        inline: false
                    },
                    {
                        name: 'Price: ',
                        value: `${shopcst} cash`,
                        inline: false
                    },
                    {
                        name: 'Discount: ',
                        value: `${roddis}% off`,
                        inline: false
                    },
                    {
                        name: 'On shell: ',
                        value: `${!rodlimit}`,
                        inline: false
                    },
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