require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

//ID's
const GUILD_ID = "945631203220946955"

const CLIENT_ID = "845724615967113217"

//I have no fucking idea on what I'm doing


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const commands = [];

client.commands = new Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}.`)

    

    const rest = new REST({ version: '9' }).setToken('ODQ1NzI0NjE1OTY3MTEzMjE3.YKlIbQ.dXCtdwyT8Iwf2bh6tCYI19aWbes');

    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');
    
            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
                { body: commands },
            );
    
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();

    client.user.setActivity("while pretending to work", { type: "PLAYING" });
})

client.on("messageCreate", message => {
    if (message.content.startsWith(">")) {
        if (message.content.substring(1) === "ping") {
            message.reply("Pong!");
        }
    }
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(process.env.TOKEN);