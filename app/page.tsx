'use client';

import { useCallback, useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { User } from "stream-chat";
import { LoadingIndicator } from "stream-chat-react";
import MyChat from "@/components/MyChat";

type HomeState = {
  apiKey: string;
  user: User;
  token: string;
}

export default function Home() {
  const [homeState, setHomeState] = useState<HomeState | undefined>();

  const { user: clerkUser } = useClerk();

  const registerUser = useCallback(async function registerUser() {
    const userId = clerkUser?.id;
    const mail = clerkUser?.primaryEmailAddress?.emailAddress;

    if (userId && mail){
      const response = await fetch("/api/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId, email: mail}),
      });
      const responseBody = await response.json();
      return await responseBody;
    }

  }, [clerkUser]);

  async function getUserToken(userId: string, userName: string) {
    const response = await fetch("api/token", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ userId: userId }),
    });

    const responseBody = await response.json();
    const token = responseBody.token;

    if (!token) {
      console.error("Token not found");
    }

    const user: User = {
      id: userId,
      name: userName,

      image: "https://getstream.io/random_png/id=userId&name=userName",
    };

    console.log("HOMESTATEBEINGSET NOW");
    // const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY || "";
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    if (apiKey) {
      setHomeState({ apiKey: apiKey, user: user, token: token });
    }
  }

  useEffect(() => {
  // 1. Wait for Clerk to load
  if (!clerkUser) return;

  const init = async () => {
    // 2. Check if we need to register
    if (!clerkUser.publicMetadata?.streamRegistered) {
      console.log("Registering user...");
      await registerUser();
      
      // 3. CRITICAL: Force Clerk to refresh the local user object 
      // so publicMetadata.streamRegistered becomes true
      await clerkUser.reload(); 
    }

    // 4. Now fetch the token and set state to remove LoadingIndicator
    console.log("Fetching token...");
    await getUserToken(
      clerkUser.id,
      clerkUser.primaryEmailAddress?.emailAddress || "Unknown"
    );
  };

  init();
}, [clerkUser, registerUser]); // getUserToken doesn't need to be here if it's stable
  

  if (!homeState) {
    return <LoadingIndicator />;
  }

  return <MyChat {...homeState}/>

}
