const { serverId, dev, clientId} = require('../../../config.json');

module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return;

    await interaction.deferReply({ ephemeral: true});

    console.log('error here');
    
    try {
        const role = interaction.guild.roles.cache.get(interaction.customId);
        if(!role){
            interaction.editReply({
                content: "No this role",
            })
            return;
        }

        const hasRole = interaction.member.roles.cache.has(role.id);
        if(hasRole){
            await interaction.member.roles.remove(role);
            await interaction.editReply(`The role ${role} has been removed.`);
            return;
        }

        await interaction.member.roles.add(role);
        await interaction.editReply(`The role ${role} has been added.`);
    } catch (error) {
        console.log(error);
    }
};