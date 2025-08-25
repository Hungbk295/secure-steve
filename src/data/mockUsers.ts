import { UserRole } from "@/constants/roleConfig";

export interface MockUser {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  department: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    username: "admin@company.com",
    password: "admin123!@#",
    role: UserRole.ADMINISTRATOR,
    name: "관리자",
    department: "IT부서",
    email: "admin@company.com",
    phone: "010-1234-5678",
    avatar: "/avatars/admin.png"
  },
  {
    id: 2,
    username: "operator@company.com",
    password: "operator123!@#",
    role: UserRole.SECURITY_OPERATOR,
    name: "보안담당자",
    department: "보안부서",
    email: "operator@company.com",
    phone: "010-2345-6789",
    avatar: "/avatars/operator.png"
  },
  {
    id: 3,
    username: "user@company.com",
    password: "user123!@#",
    role: UserRole.USER,
    name: "일반사용자",
    department: "영업부서",
    email: "user@company.com",
    phone: "010-3456-7890",
    avatar: "/avatars/user.png"
  }
];

export const authenticateUser = (username: string, password: string): MockUser | null => {
  const user = MOCK_USERS.find(u => u.username === username && u.password === password);
  return user || null;
};

export const getUserByRole = (role: UserRole): MockUser[] => {
  return MOCK_USERS.filter(user => user.role === role);
};

export const getUserById = (id: number): MockUser | null => {
  return MOCK_USERS.find(user => user.id === id) || null;
}; 