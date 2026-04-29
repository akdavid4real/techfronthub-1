'use client'

import React, { createContext, useContext } from 'react'

const AuthCtx = createContext(null)

export const useAuth = () => useContext(AuthCtx)

export function AdminAuthProvider({ children, value }) {
  return (
    <AuthCtx.Provider value={value}>
      {children}
    </AuthCtx.Provider>
  )
}
