require('dotenv').config();
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { serverId, dev, clientId, fisherRoleId, 修士RoleId} = require('../../../config.json');

const roles = [
    {
        id: fisherRoleId,
        label: 'Fisher🎣',
    },
    {
        id: 修士RoleId,
        label: '修士🔥',
    },
]

module.exports = async (client) =>{
    return;
    try{
        const channel = await client.channels.cache.get('1127424181521354793');
        if(!channel)return;

        const row = new ActionRowBuilder();

        roles.forEach((role) => {
            row.components.push(
                new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
            );
        });

        await channel.send({
            content: 'Sign in your roles below.',
            components:[row],
        });
        process.exit();

    } catch (error) {
        console.log(error);
    }
};

