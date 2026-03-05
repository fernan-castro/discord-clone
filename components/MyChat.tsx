import { useEffect } from 'react';
import { useClient } from '@/hooks/useClient';
// import { APIKey } from '@clerk/backend';
import { User } from 'stream-chat';
import { 
    Chat, 
    Channel, 
    ChannelList, 
    ChannelHeader, 
    MessageList, 
    MessageInput, 
    Thread, 
    Window } from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css'

export default function MyChat({
    apiKey, 
    user,
    token,
}: {
    apiKey: string;
    user: User;
    token: string;
}) {
    const chatClient = useClient({
        apiKey,
        user,
        tokenOrProvider: token,
    });

    const filters = {
        type: 'messaging',
        members: { $in: [user.id]},
    };

    const sort = { last_message_at: -1 as const };

    // // 2. TEMPORARY: Create a channel so you have something to see
    // useEffect(() => {
    //     if (!chatClient) return;

    //     const createTestChannel = async () => {
    //         const channel = chatClient.channel('messaging', 'general-chat', {
    //             members: [user.id], // You must include yourself!
    //             name: 'General Chat',
    //         } as any);
            
    //         // .watch() creates the channel if it doesn't exist and subscribes to updates
    //         await channel.watch();
    //     };

    //     createTestChannel();
    // }, [chatClient, user.id]);

    if (!chatClient) {
        return <div> Error, please try again later. </div>
    }

    return (
        <Chat client={chatClient} theme='str-chat_theme-light'>
            <section className='flex h-screen w-full overflow-hidden'>
                {/* 1. Sidebar */}
                <ChannelList filters={filters} sort={sort}/>

                {/* 2. Main chat area */}
                <div className="flex-1 flex flex-col">
                    <Channel>
                        <Window>
                            <ChannelHeader />
                            <MessageList />
                            <MessageInput />
                        </Window>
                        <Thread/>
                    </Channel>
                </div>
            </section>
        </Chat>
    )
}