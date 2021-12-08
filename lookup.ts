import { VoiceMessage } from 'discord-speech-recognition';
import { GuildMember } from 'discord.js';

const lookupTable: Record<string, GuildMember> = {};

export function lookup(message: VoiceMessage, name: string): GuildMember | null  {
    if (lookupTable[name]) {
        return lookupTable[name];
    } else {
        const member = message.guild.members.cache.find((curMember: GuildMember): boolean => {
            if (curMember.displayName.includes(name) || curMember.nickname?.includes(name)) {
                return true;
            }
            return false;
        });

        if (member) {
            lookupTable[name] = member;
        }
    }
    return null;
}