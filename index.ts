import { Client, Intents, Message } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';
import { addSpeechEvent, VoiceMessage } from 'discord-speech-recognition';
import { lookup } from './lookup';
import { config } from 'dotenv';

config();

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


client.on('speech', async (msg: VoiceMessage) => {
    if (msg.error) {
        console.log('Error occurred', msg.error);
        return;
    }

    console.log(msg.content);
    
    if (msg.content === 'bye') {
        const member = msg.member;

        if (member) {
            member.edit({
                channel: null
            });
        }
        return;
    }

    if (msg.content?.includes('kick')) {
        const personToKick = msg.content.split(' ')[1];

        if (personToKick) {
            const member = lookup(msg, personToKick);
            if (member) {
                member.edit({
                    channel: null
                });
                console.log(`Kicked ${personToKick}`);
                return;
            }
            console.log('No member found');
            return;
        } 
        console.log('No one to kick');
    }

    if (msg.content?.includes('tell')) {
        // create a message to send to a member

        const personToSendTo = msg.content.split(' ')[1];
        const indexIgnore = msg.content.lastIndexOf(personToSendTo);
        const message = msg.content.substring(personToSendTo.length+indexIgnore+1, msg.content.length);

        if (personToSendTo) {
            const member = lookup(msg, personToSendTo);

            if (member) {
                member.send(message);
            }
        }
    }
});

client.on('ready', () => {
    console.log('Bot is ready!');
});

client.login(token);