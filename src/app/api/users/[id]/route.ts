import { NextResponse, type NextRequest } from 'next/server';

type User = {
  id: number;
  name: string;
};

const users: User[] = [
  { id: 1, name: 'ichiro' },
  { id: 2, name: 'jiro' },
];

// PUT /api/users/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const updatedUser: User = await request.json();
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser };
    return NextResponse.json(users[index]);
  }

  return NextResponse.json({ error: 'User not found' }, { status: 404 });
}
