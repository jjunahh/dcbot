const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const snipedMessages = new Map();

client.once('ready', () => {
    console.log(`✅ Ready! Logged in as: ${client.user ? client.user.tag : 'Bot'}`);
});

client.on('messageDelete', (message) => {
    if (!message || !message.author || message.author.bot) return;
    snipedMessages.set(message.channelId, message);
});

client.on('messageCreate', async (message) => {
    if (!message || message.author.bot || !message.guild) return;

    if (message.content === ',snipe') {
        const targetMessage = snipedMessages.get(message.channelId);
        if (!targetMessage) {
            return message.reply('❌ There is nothing to snipe!').catch(() => {});
        }

        const embed = new EmbedBuilder()
            .setDescription(targetMessage.content || '*No text content*')
            .setColor(0x2b2d31)
            .setAuthor({ 
                name: targetMessage.author.tag || 'Unknown User', 
                iconURL: targetMessage.author.displayAvatarURL ? targetMessage.author.displayAvatarURL() : undefined 
            })
            .setTimestamp(targetMessage.createdAt || new Date())
            .setFooter({ text: `Requested by ${message.author.tag}` });

        await message.channel.send({ embeds: [embed] }).catch(() => {});
    }
});

if (!process.env.DISCORD_TOKEN) {
    console.error("❌ ERROR: DISCORD_TOKEN is missing in your environment variables!");
} else {
    client.login(process.env.DISCORD_TOKEN);
}
