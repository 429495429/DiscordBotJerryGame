const Fisher = require('../../model/fisher');
const cooldowns = new Set();

function getRandomLure(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max-min + 1) + min);
}

module.exports = {
    deleted: false,
    name: 'sign',
    description: 'Signin as a fisher!',
    // devOnly: Boolean,
    // testOnly: true,
    
    callback: async (client, interaction) => {
        if(!interaction.inGuild() || interaction.user.bot ) return;
        if(cooldowns.has(interaction.member.user.id)){
            interaction.reply(`${interaction.member} you have already sign today!`);
            return;
        }else {

            const lureToGive = getRandomLure(20,50);
            
            const query = {
                userId: interaction.member.user.id,
                guildId: interaction.guild.id
            };
            try {
                const fisher = await Fisher.findOne(query);

                if(fisher){
                    fisher.lure += lureToGive;
                    await fisher.save().catch((e) => {
                        console.log(`Error saving updated fisher data ${e}`);
                        return;
                    });

                } else {
                    const newfisher = new Fisher({
                        userId: interaction.member.user.id,
                        guildId: interaction.guild.id,
                        lure: lureToGive
                    });

                    await newfisher.save();
                }
                await interaction.reply(`${interaction.member} sign! Get ${lureToGive} lures as reward!`);
                cooldowns.add(interaction.member.user.id);
                setTimeout(() => {
                    cooldowns.delete(interaction.member.user.id);
                }, 79200000);
            } catch (error) {
                console.log(error);
            }
        }
        
    },
};