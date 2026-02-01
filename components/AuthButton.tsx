"use client";

import { createClient } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Github, LogOut, User as UserIcon } from "lucide-react";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // 1. Cek apakah user sedang login
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    // 2. Pasang "telinga" untuk mendengar jika user login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return user ? (
    // Tampilan SUDAH Login
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
        {user.user_metadata.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt="Avatar"
            className="w-8 h-8 rounded-full border border-zinc-700"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
            <UserIcon size={16} />
          </div>
        )}
        <span className="hidden md:inline">
          {user.user_metadata.full_name || "User"}
        </span>
      </div>

      <button
        onClick={handleLogout}
        className="p-2 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded-lg transition-colors"
        title="Logout"
      >
        <LogOut size={18} />
      </button>
    </div>
  ) : (
    // Tampilan BELUM Login
    <button
      onClick={handleLogin}
      className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 px-4 py-2 rounded-lg font-medium text-sm transition-all"
    >
      <Github size={18} />
      <span>Login</span>
    </button>
  );
}
