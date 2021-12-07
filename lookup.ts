import { GuildMember, Client, User } from 'discord.js';

const lookupTable: Record<string, GuildMember> = {};

export function lookup(client: Client, name: string): GuildMember | null  {
    if (lookupTable[name]) {
        return lookupTable[name];
    } else {
        const userId= client.users.cache.find((user: User) => user.username === name)?.id;
        
        // get guild member from user id
    }
    return null;
}