import { Client, Intents, Message } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';
import { addSpeechEvent, VoiceMessage } from 'discord-speech-recognition';

const token = process.env.LOGIN_TOKEN;

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
    ]
});

addSpeechEvent(client);

client.on('messageCreate', (msg: Message) => {
    if (msg.author.bot) {
        return;
    }
    const voiceChannel = msg.member?.voice.channel;

    if (msg.content.includes('join') && msg.mentions.has(client.user?.id || '')) {
        if (voiceChannel) {
            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel?.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                selfDeaf: false
            });
        }
    }
});


client.on('speech', (msg: VoiceMessage) => {
    console.log(msg);

    if (msg.content === 'kick') {
        const member = msg.member;

        if (member) {
            member.edit({
                channel: null
            });
        }
        return;
    }

    if (msg.content?.includes('move')) {
        const personToMove = msg.content.split(' ')[1];

        if (personToMove) {
            
        }
    }
});

client.on('ready', () => {
    console.log('Bot is ready!');
});

client.login(token);