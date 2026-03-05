// import { clerkClient } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
import { StreamChat } from "stream-chat";

export async function POST(request: Request) {
    const apiKey = process.env.STREAM_API_KEY || "";

    if (!apiKey) {
        return Response.error();
    }

    const serverClient = StreamChat.getInstance(
        apiKey,
        process.env.STREAM_API_SECRET
    );

    const body = await request.json();
    console.log('[/api/register-user] Body: ', body);

    const userId = body?.userId;
    const email = body?.email;

    if (!userId || !email) {
        return Response.error();
    }

    const user = await serverClient.upsertUser({
        id: userId,
        role: 'user',
        name: email,
        image: `https://getstream.io/random_png/?id=${userId}&name=${email}`,
    });

    const params = {
        publicMetadata: {
            streamRegistered: true,
        },
    };
    const clerk = await clerkClient();
    const updatedUser = await clerk.users.updateUser(userId, params);

    console.log('[/api/register-user] User: ', updatedUser);
    const response = {
        userId: userId,
        userName: email,
        
    };

    return Response.json(response);
}
