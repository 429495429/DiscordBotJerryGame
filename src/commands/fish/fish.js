const Fisher = require('../../model/fisher');
const Fish = require('../../model/fish');
const FishType = require('../../model/fishType');
const cooldowns = new Set();
const FISH_BASCI_TIME = 300000;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const Equipship = require('../../model/equipship');
const Rod = require('../../model/rod');
const { Types } = require('mongoose');

function getRandom(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max-min + 1) + min);
}

function getRandomFish(list){
    const randomIndex = Math.floor(Math.random()*list.length);
    return list[randomIndex];
}

const magicRodScale = {
    r0r: 50,
    r1r: 650,
    r2r: 270,
    r3r: 30,
    r4r: 0,
    r5r: 0,
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
            await interaction.reply(`${interaction.member} Dont hurry! The fish will run!`);
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

                    //check fisher's equiped rod and define variables for fishing
                    var rank0rate;
                    var rank1rate;
                    var rank2rate;
                    var rank3rate;
                    var rank4rate;
                    var totalrate;
                    const equipshipquery = {
                        ownerId:interaction.member.user.id
                    }
                    const equipship = await Equipship.findOne(equipshipquery);
                    if(equipship){
                        const rodid = new Types.ObjectId(equipship.rodId);
                        const rodquery = {
                            _id:rodid
                        };
                        
                        const rod = await Rod.findOne(rodquery);

                        rank0rate = rod.rare0rate;
                        rank1rate = rank0rate + rod.rare1rate;
                        rank2rate = rank1rate + rod.rare2rate;
                        rank3rate = rank2rate + rod.rare3rate;
                        rank4rate = rank3rate + rod.rare4rate;
                        totalrate = rank4rate + rod.rare5rate;
                        fishtime = rod.basictime;
                        fishtime = 10000;
                        console.log(`${rank0rate} ${rank4rate}`);

                    }else {
                        rank0rate = magicRodScale.r0r;
                        rank1rate = rank0rate + magicRodScale.r1r;
                        rank2rate = rank1rate + magicRodScale.r2r;
                        rank3rate = rank2rate + magicRodScale.r3r;
                        rank4rate = rank3rate + magicRodScale.r4r;
                        totalrate = rank4rate + magicRodScale.r5r;
                        
                    }

                    //start fishing
                    await interaction.reply(`${interaction.member} start fishing, please wait for ${fishtime/1000} seconds.`)

                    //settup time of taking on fishing
                    cooldowns.add(interaction.member.user.id);
                    setTimeout(() => {
                        cooldowns.delete(interaction.member.user.id);
                    }, fishtime);
                    await delay(fishtime);

                    //fishing result on lure and exp
                    fisher.lure --;
                    fisher.exp ++;
                    await fisher.save().catch((e) => {
                        console.log(`Error saving updated fisher data ${e}`);
                        return;
                    });

                    //detemin what rarelity of fish the user can get
                    var fishrank;
                    var resulttext;
                    var resultrank = getRandom(0,totalrate);
                    
                    if(resultrank > rank4rate ){
                        fishrank = 5;
                        resulttext = '@c!59y;4d#%@j♢878□bdf;#!@@!8b4yh3g67@d#9@6d85%@!h78@s2g;d6c#t9y6';
                    } else if (resultrank > rank3rate ){
                        fishrank = 4;
                        resulttext = 'It looks a bit weird, you have get a superior';
                    } else if (resultrank > rank2rate){
                        fishrank = 3;
                        resulttext = 'Congradulation, Chosen One! You have get a Luxurious';
                    } else if (resultrank > rank1rate ){
                        fishrank = 2;
                        resulttext = 'A huge tension! After a hard fighting, you have get a superior';
                    } else if(resultrank > rank0rate){
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
                    const newfishlength = getRandom(resultfishtype.minlength, resultfishtype.maxlength);
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