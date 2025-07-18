
import { api } from "@/trpc/server";
import AdminLoginClient from "./admin-login-client";

export default async function AdminLoginPage() {
  const profile = await api.profile.get();
  
  return <AdminLoginClient profile={profile} />;
} 