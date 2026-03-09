import { JSX } from "react";
import { v4 as uuid } from 'uuid';
import Image from "next/image";
import { useState } from "react";

export default function ServerList(): JSX.Element {
    const [activeServer, setActiveServer] = useState<DiscordServer | undefined>();
    const servers: DiscordServer[] = [
        {
            id: '1',
            name: 'Test server 1',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
            id: '2',
            name: 'Test server 2',
            image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
            id: '3',
            name: 'Test server 3',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
    ];
    return (
    <div className='bg-gray-300 h-full flex flex-col items-center'>
        {servers.map((server) => (
            <button 
            key={server.id} className={`p-4 sidebar-icon ${server.id === activeServer?.id ? 'selected-icon' : ''}`} onClick={() => setActiveServer(server)}>
                {server.image && checkIfUrl(server.image) ? (
                    <Image 
                        className="rounded-icon"
                        src={server.image}
                        width={50}
                        height={50}
                        alt='Server Icon'
                    />
                ):(
                    <span className="rounded-icon bg-gray-600 w-12 flex items-center justify-center text-sm">
                        {server.name.charAt(0)}
                    </span>
                )}
            </button>
        ))}
    </div>
    );

    function checkIfUrl(path: string): Boolean {
        try {
            const _ = new URL(path);
            return true;
        } catch (_) {
            return false;
        }
    }
}