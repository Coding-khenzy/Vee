const Discord = require('discord.js');
const firstMessage = require('./firstMessage');


module.exports = client => {
    const imageUrl = 'https://cdn.discordapp.com/attachments/808326174110777384/808346821725650954/logo1024x1024.png';
    const channelId = '808323885279739924'
    
    const verifyEmbed = new Discord.MessageEmbed()
    .setTitle('Verify to gain server access')
    .setColor('#98ff91')
    .setAuthor('Verification', imageUrl)
    .addField('How to verify.', 'React on this message with <:verify:798167751386071090> to verify yourself and gain access.')
    .addField('Rules', ':small_orange_diamond:This server follows the Discord Community Guidelines.', false)
    .addField('Info', '> **Admins** and **Mods** reserve the right to `MUTE`, `KICK` or `BAN` for not following these guidelines.', false)
    .addField('Discord Guidelines', 'https://discord.com/guidelines', false)
    .setTimestamp()
    const emojis = {
        Verified: 'Verified'
    }

    const reactions = ['798167751386071090']

    firstMessage(client, channelId, verifyEmbed, reactions);

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