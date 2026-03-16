export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export function validateRegister(data: RegisterInput): string | null {
  if (!data.name || data.name.trim().length < 2)
    return "Name must be at least 2 characters";
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    return "Invalid email address";
  if (!data.password || data.password.length < 6)
    return "Password must be at least 6 characters";
  return null;
}

export function validateLogin(data: LoginInput): string | null {
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    return "Invalid email address";
  if (!data.password) return "Password is required";
  return null;
}