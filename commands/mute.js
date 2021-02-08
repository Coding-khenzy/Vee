const redis = require('./redis');
const command = require('./command');
const Discord = require('discord.js');


module.exports = client => {
    const redisKeyPrefix = 'muted-';
    let channelLog = client.channels.cache.get('808326056179138591')
    const imageUrl = 'https://cdn.discordapp.com/attachments/808326174110777384/808346821725650954/logo1024x1024.png';

    redis.expire(message => {
        if (message.startsWith(redisKeyPrefix)) {
            const split = message.split('-')

            const memberId = split[1]
            const guildId = split[2]

            const guild = client.guilds.cache.get(guildId)
            console.log(guild.name)
            const member = guild.members.cache.get(memberId)

            const role = getRole(guild)
            member.roles.remove(role)
            console.log(`Unmuted: ${member.id}`)

            const unmutedLog = new Discord.MessageEmbed()
            .setTitle(`Expired: ${member.id}`)
            .setColor('#98ff91')
            .setAuthor('Unmuted Log', imageUrl)
            .setTimestamp()
                
            try { 
                channelLog.send(unmutedLog);
                
            }
            catch(err) {
                console.error(err)
            }

        }
    })

    const getRole = (guild) => {
        return guild.roles.cache.find((role) => role.name === 'Muted')
    }


    const giveRole = member => {
        const role = getRole(member.guild)
        if (role) {
            member.roles.add(role)
        }
    }

    const onJoin = async member => {
        const { id, guild } = member;

        

        const redisClient = await redis()
        try {
            redisClient.get(`${redisKeyPrefix}${id}-${guild.id}`, (err, result) => {
                if (err) {
                    console.error('Redis GET error: ', err)
                } else if (result) {
                    giveRole(member);
                } else {
                    console.log('Could not find the Muted role')
                }
            })
        } finally {
            redisClient.quit()
        }
    }

    command(client, 'simjoin', message => {
        onJoin(message.member)
    })

    client.on('guildMemberAdd', member => {
        onJoin(member)
    })

    command(client, 'mute', async message => {
        // ve!mute @user duration duration_type(h, m, s)

        const syntax = '!mute <@user> <duration as number> <m, h, d or lifetime>'
        const { member, channel, content, mentions, guild } = message

        if (!member.hasPermission('ADMINISTRATOR')) {
            channel.send('You do not have permission to run this command');
            return;
        }

        const split = content.trim().split(' ')
        
        if (split.length !== 4) {
            channel.send('Please use the correct syntax: ' + syntax)
        }

        const duration = split[2]
        const durationType = split[3]

        if(isNaN(duration)) {
            channel.send('Please provide a number for the duration. ' + syntax)
            return
        }

        const durations = {
            m: 60,
            h: 60 * 60 ,
            d: 60 * 60 * 24,
            lifetime: -1
        }

        
        

        const mutedLog = new Discord.MessageEmbed()
        .setTitle(`Muted User: ${member.id}`)
        .setColor('#d11c1c')
        .setAuthor('Muted Log', imageUrl)
        .addFields(
            {name: 'Expires', value: `${duration} ${durationType}`}
        )
        .setTimestamp()
            
        try { 
            channelLog.send(mutedLog);
            
        }
        catch(err) {
            console.error(err)
        }
        

        

        if (!durations[durationType]) {
            channel.send('Please provide a valid duration type' + syntax)
            return
        }

        const seconds = duration * durations[durationType]


        const target = mentions.users.first()

        console.log(`Muted: ${target}`)
        

        if(!target) {
            channel.send('Please tag a user to mute.')
            return
        }

        const { id } = target

        const targetMember = guild.members.cache.get(id)
        giveRole(targetMember)

        

        const redisClient = await redis()
        try {
            const redisKey = `${redisKeyPrefix}${id}-${guild.id}`
            if (seconds > 0) {
                redisClient.set(redisKey, 'true', 'EX', seconds)
            } else {
                redisClient.set(redisKey, 'true')
            }

        } finally {
            redisClient.quit()
        }
        
        
    })
}