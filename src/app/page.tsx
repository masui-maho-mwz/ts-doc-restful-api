'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

type User = {
  id: number;
  name: string;
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUserName, setNewUserName] = useState('');
  const [editingUser, setEditingUser] = useState<{ id: number; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError('Failed to fetch users. Please try again later.');
    }
  }

  async function handleAddUser() {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: users.length + 1, name: newUserName }),
      });
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      const newUser = await response.json();
      setUsers([...users, newUser]);
      setNewUserName('');
      setError(null);
    } catch (error) {
      setError('Failed to add user. Please try again.');
    }
  }

  function handleEdit(user: User) {
    setEditingUser({ id: user.id, name: user.name });
    setError(null);
  }

  async function handleUpdateUser(e: React.MouseEvent) {
    e.preventDefault();

    if (!editingUser) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editingUser.name }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await response.json();

      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      setEditingUser(null);
      setError(null);
    } catch (error) {
      setError('Failed to update user. Please try again.');
    }
  }

  return (
    <div className={styles.root}>
      <h1>Users</h1>
      {error && <div>{error}</div>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {editingUser?.id === user.id ? (
              <>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
                <button onClick={handleUpdateUser}>Save</button>
              </>
            ) : (
              <>
                {user.name}
                <button onClick={() => handleEdit(user)}>Update</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newUserName}
        onChange={(e) => setNewUserName(e.target.value)}
        placeholder="New user name"
      />
      <button onClick={handleAddUser}>Add User</button>
    </div>
  );
}
