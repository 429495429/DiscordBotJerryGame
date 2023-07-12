const Fisher = require('../../model/fisher');
const Fish = require('../../model/fish');
const FishType = require('../../model/fishType');
const cooldowns = new Set();
const FISH_BASCI_TIME = 300000;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function getRandom(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max-min + 1) + min);
}

function getRandomFish(list){
    const randomIndex = Math.floor(Math.random()*list.length);
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

                //check if the user is alreayd signin as fisher
                if(fisher){

                    //check if user have lure
                    if(fisher.lure < 1){
                        interaction.reply('You have no lure');
                        return;
                    }

                    //start fishing
                    await interaction.reply(`${interaction.member} start fishing, please wait for ${fishtime/1000} seconds.`)

                    //settup time of taking on fishing
                    cooldowns.add(interaction.member.user.id);
                    setTimeout(() => {
                        cooldowns.delete(interaction.member.user.id);
                    }, fishtime);
                    await delay(fishtime);

                    //fishing result
                    await fisher.lure --;
                    await fisher.exp ++;
                    await fisher.save().catch((e) => {
                        console.log(`Error saving updated fisher data ${e}`);
                        return;
                    });
                    
                    //detemin what rarelity of fish the user can get
                    var resultrank = getRandom(0,100);
                    var fishrank;
                    var resulttext;
                    if(resultrank > 1000 ){
                        fishrank = 5;
                        resulttext = '@c!59y;4d#%@j♢878□bdf;#!@@!8b4yh3g67@d#9@6d85%@!h78@s2g;d6c#t9y6';
                    } else if (resultrank > 1000 ){
                        fishrank = 4;
                        resulttext = 'It looks a bit weird, you have get a superior';
                    } else if (resultrank > 970){
                        fishrank = 3;
                        resulttext = 'Congradulation, Chosen One! You have get a Luxurious';
                    } else if (resultrank > 700 ){
                        fishrank = 2;
                        resulttext = 'A huge tension! After a hard fighting, you have get a superior';
                    } else if(resultrank > 50){
                        fishrank = 1;
                        resulttext = 'Woo~ A nice fish, you have get a common';
                    } else {
                        await interaction.followUp(`${interaction.member} fishing end, you catch your own shoe.`);
                        return;
                    }
                    const fishtypequery = {
                        rare: fishrank
                    };
                    const fishlist = await FishType.find(fishtypequery);
                    const resultfishtype = await getRandomFish(fishlist);
                    
                    //creating object fish
                    const newfishname = resultfishtype.fishname;
                    const newfishlength = await getRandom(resultfishtype.minlength, resultfishtype.maxlength);
                    const newfishprice = resultfishtype.unitprice*newfishlength
                    const newfish = new Fish({
                        fishname: newfishname,
                        length: newfishlength,
                        ownerId: fisher.userId,
                        price: newfishprice,
                    });
                    await newfish.save();

                    //anounce fisher
                    await interaction.followUp(`${interaction.member} ${resulttext} ${newfishname} with ${newfishlength} long, worth ${newfishprice}!`);

                } else {
                    await interaction.reply('You have not signin as a fisher yet!');
                }
                
                
            } catch (error) {
                console.log(error);
            }
        }
        
    },
};