const firstMessage = require('./firstMessage');
const Discord = require('discord.js');
const imageUrl = 'https://cdn.discordapp.com/attachments/808326174110777384/808346821725650954/logo1024x1024.png';


module.exports = client => {
    const channelId = '808326627385016380'

    const rankedRoles = new Discord.MessageEmbed()
    .setTitle('Choose your rank!')
    .setColor('#98ff91')
    .setAuthor('Ranked Roles', imageUrl)
    .addField('Radiant', '<:Radiant:763137091310714900>', true)
    .addField('Immortal', '<:Immortal:763137091256582144>', true)
    .addField('Diamond', '<:Diamond:763137091092742164>', true)
    .addField('Platinum', '<:Platinum:763137091281354802>', true)
    .addField('Gold', '<:Gold:763137091155787796>', true)
    .addField('Silver', '<:Silver:798190788668162048>', true)


    const emojis = {
        Radiant: 'Radiant',
        Immortal: 'Immortal',
        Diamond: 'Diamond',
        Platinum: 'Platinum',
        Gold: 'Gold',
        Silver: 'Silver'
    }

    const reactions = ['763137091310714900', '763137091256582144', '763137091092742164', '763137091281354802', '763137091155787796', '798190788668162048'];

    firstMessage(client, channelId, rankedRoles, reactions);

    const handleReaction = (reaction, user, add) => {
        if (user.id === '808095720455798795') {
            return;
        };

        const emoji = reaction._emoji.name;

        const { guild } = reaction.message;

        const roleName = emojis[emoji];
        if(!roleName){
            return
        };

        const role = guild.roles.cache.find(role => role.name === roleName)
        const member = guild.members.cache.find(member => member.id === user.id)

        if(add) {
            member.roles.add(role)
        } else {
            member.roles.remove(role)
        }

    }


    client.on('messageReactionAdd', (reaction, user) => {
        if(reaction.message.channel.id === channelId) {
            handleReaction(reaction, user, true)
        }
    });

    client.on('messageReactionRemove', (reaction, user) => {
        if(reaction.message.channel.id === channelId) {
            handleReaction(reaction, user, false)
        }
    });


}