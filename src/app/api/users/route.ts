import { NextResponse } from 'next/server';

type User = {
  id: number;
  name: string;
};

export const users: User[] = [
  { id: 1, name: 'ichiro' },
  { id: 2, name: 'jiro' },
];

// GET /api/users
export async function GET() {
  return NextResponse.json(users);
}
