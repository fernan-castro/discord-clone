import { useEffect, useState } from "react";
import { StreamChat, TokenOrProvider, User } from "stream-chat";

export type UseClientOptions = {
  apiKey: string;
  user: User;
  tokenOrProvider: TokenOrProvider;
};

export const useClient = ({ 
    apiKey, 
    user, 
    tokenOrProvider 
}: UseClientOptions): StreamChat | undefined => {
    const [client, setClient] = useState<StreamChat>();

    useEffect(() => {
        const chatClient = new StreamChat(apiKey);
        let didUserConnectInterrupt = false;
        
        const connectionPromise = chatClient
        .connectUser(user, tokenOrProvider)
        .then(() => { 
            if (!didUserConnectInterrupt) {
                setClient(chatClient);
            }
        });

        return () => {
            didUserConnectInterrupt = true;
            setClient(undefined);
            connectionPromise
            .then(() => chatClient.disconnectUser())
            .then(() => {
                console.log("User disconnected");
            });
        };
    }, [apiKey, user.id, tokenOrProvider]);

    return client;
};