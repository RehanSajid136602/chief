import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
  favorites?: string[];
}

interface UsersData {
  users: User[];
}

function readUsersFile(): UsersData {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading users file:", error);
  }
  return { users: [] };
}

function writeUsersFile(data: UsersData): void {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const data = readUsersFile();
  const user = data.users.find((u) => u.email === email) || null;
  if (user && !user.favorites) {
    user.favorites = [];
  }
  return user;
}

export async function updateUser(
  email: string,
  updates: Partial<User>
): Promise<User | null> {
  const data = readUsersFile();
  const userIndex = data.users.findIndex((u) => u.email === email);
  if (userIndex === -1) return null;

  data.users[userIndex] = {
    ...data.users[userIndex],
    ...updates,
    favorites: updates.favorites || data.users[userIndex].favorites || [],
  };

  writeUsersFile(data);
  return data.users[userIndex];
}

export async function createUser(
  email: string,
  name: string,
  password: string
): Promise<User> {
  const data = readUsersFile();
  
  const existingUser = data.users.find((u) => u.email === email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  
  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    name,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    favorites: [],
  };

  data.users.push(newUser);
  writeUsersFile(data);

  return newUser;
}

export async function verifyPassword(
  user: User,
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, user.password);
}

