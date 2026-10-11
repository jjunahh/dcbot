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
    console.log(`✅ Ready! Logged in as: ${client.user.tag}`);
});

client.on('messageDelete', (message) => {
    if (!message.author || message.author.bot) return;
    snipedMessages.set(message.channelId, message);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    if (message.content === ',snipe') {
        const targetMessage = snipedMessages.get(message.channelId);
        if (!targetMessage) return message.reply('❌ There is nothing to snipe!');

        const embed = new EmbedBuilder()
            .setDescription(targetMessage.content || '*No text content*')
            .setColor(0x2b2d31)
            .setAuthor({ name: targetMessage.author.tag, iconURL: targetMessage.author.displayAvatarURL() })
            .setTimestamp(targetMessage.createdAt)
            .setFooter({ text: `Requested by ${message.author.tag}` });

        await message.channel.send({ embeds: [embed] });
    }
});

client.login(process.env.MTU1ODkxMzQzOTQxMjM5MTk0MA.Gqd6h5.rlOKj_ECXq03n7H-Kvmtt6YWwV2vkOa9BD2uhk);