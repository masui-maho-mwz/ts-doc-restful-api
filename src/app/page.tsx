'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

type User = {
  id: number;
  name: string;
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
  }

  async function handleAddUser() {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: users.length + 1, name }),
    });
    const newUser = await response.json();
    setUsers([...users, newUser]);
    setName('');
  }

  return (
    <div className={styles.root}>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleAddUser}>Add User</button>
    </div>
  );
}
