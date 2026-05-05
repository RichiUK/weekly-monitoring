"use client"

import { signOut } from "next-auth/react"

type Props = {
  email?: string | null
  name?: string | null
}

export function SignOutButton({ email, name }: Props) {
  return (
    <div className="flex items-center gap-3">
      {(name || email) && (
        <div className="text-right hidden sm:block">
          {name && <div className="text-xs text-slate-400 leading-tight">{name}</div>}
          {email && <div className="text-xs text-slate-600 leading-tight">{email}</div>}
        </div>
      )}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2.5 py-1.5 rounded border border-slate-700 hover:border-slate-500 whitespace-nowrap"
      >
        Sign out
      </button>
    </div>
  )
}
