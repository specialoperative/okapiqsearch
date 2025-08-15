"use client";

import React from "react";
import { useAuth } from "./AuthProvider";

export default function LoginMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);

  if (!user) {
    return (
      <a
        href="/signin"
        className="px-3 py-1.5 rounded-md border border-gray-300 hover:border-gray-400 hover:bg-gray-50"
      >
        Sign in
      </a>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-2 py-1.5 rounded-full border border-gray-300 hover:bg-gray-50"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
          {user.email.charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:block text-gray-700">{user.email}</span>
        <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"/></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-md border bg-white shadow">
          <a href="/account" className="block px-3 py-2 hover:bg-gray-50">Account</a>
          <a href="/billing" className="block px-3 py-2 hover:bg-gray-50">Billing</a>
          <button onClick={logout} className="w-full text-left px-3 py-2 hover:bg-gray-50">Sign out</button>
        </div>
      )}
    </div>
  );
}


