const Fisher = require('../../model/fisher');
const Fish = require('../../model/fish');
const FishType = require('../../model/fishType');
const cooldowns = new Set();
const FISH_BASCI_TIME = 30000;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function getRandom(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max-min + 1) + min);
}

function getRandomFish(list){
    const randomIndex = Math.floor(Math.random()*listIndexes.length);
    return list[randomIndex];
}

module.exports = {
    deleted: false,
    name: 'fish',
    description: 'Go fishing!',
    // devOnly: Boolean,
    // testOnly: true,
    
    callback: async (client, interaction) => {
        if(!interaction.inGuild() || interaction.user.bot ) return;
        if(cooldowns.has(interaction.member.user.id)){
            interaction.reply(`${interaction.member} Dont hurry! The fish will run!`);
            return;
        }else {
            
            const query = {
                userId: interaction.member.user.id,
                guildId: interaction.guild.id
            };
            try {
                const fisher = await Fisher.findOne(query);
                var fishtime = FISH_BASCI_TIME;

                if(fisher){
                    if(fisher.lure < 1){
                        interaction.reply('You have no lure');
                        return;
                    }
                    await interaction.reply(`${interaction.member} start fishing, please wait for ${fishtime/1000} seconds.`)
                    cooldowns.add(interaction.member.user.id);
                    setTimeout(() => {
                        cooldowns.delete(interaction.member.user.id);
                    }, fishtime);
                    await delay(fishtime);
                    await fisher.lure --;
                    await fisher.exp ++;
                    await fisher.save().catch((e) => {
                        console.log(`Error saving updated fisher data ${e}`);
                        return;
                    });
                    await interaction.followUp(`${interaction.member} fishing end, you get nothing!`);

                } else {
                    await interaction.reply('You have not signin as a fisher yet!');
                }
                
                
            } catch (error) {
                console.log(error);
            }
        }
        
    },
};