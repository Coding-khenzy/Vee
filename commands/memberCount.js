module.exports = client => {
    const channelId = '808334631665008670';

    const updateMember = guild => {
        const channel = guild.channels.cache.get(channelId);
        channel.setName(`User Count: ${guild.memberCount.toLocaleString()}`);

    }

    client.on('guildMemberAdd', member => updateMember(member.guild));
    client.on('guildMemberRemove', member => updateMember(member.guild));

    const guild = client.guilds.cache.get('733019823256109155');
    updateMember(guild);
}