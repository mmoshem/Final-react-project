import React from 'react';
import LogoutButton from './LogoutButton';
export default function Home() {

    // const userEmail = localStorage.getItem('userEmail');
    return (
        
       <div>
       <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Home</h1>
        <LogoutButton />
        </header>
    </div>
    );
}
