import { api } from "./axios";

export const login = async (email: string, password: string) => {
  try {
    const res = await api.post("/api/auth/sign-in", { email, password });
    return res.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Login xatolik");
  }
};

export const logout = async () => {
  await api.post("/api/auth/logout");
};
