// Modules

const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix } = require('./src/config.json');

const memberCount = require('./commands/memberCount.js');
const verify = require('./commands/verify.js')

const fs = require('fs');
const firstMessage = require('./commands/firstMessage');
const roleClaim = require('./commands/role-claim');
const mongo = require('./commands/mongo.js');
const mute = require('./commands/mute');
const levels = require('./commands/levels')

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log(`${file} loaded.`)

    client.commands.set(command.name, command);
}

require('dotenv').config();


client.on('ready', async () => {
    console.log(`${client.user.username} is ready.`);

    memberCount(client);
    mute(client);
    roleClaim(client);
    verify(client);
    levels(client);


    await mongo().then(mongoose => {
        try {
            console.log('Connected to Database!')
        } finally {
            mongoose.connection.close()
        }
    });
});


client.on('message', message => {

    if(!message.content.startsWith(prefix)) return;
    

    

    const args = message.content.slice(prefix.length).trim().split(' ');
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error executing that command.');
    };
})

client.login(process.env.TOKEN);