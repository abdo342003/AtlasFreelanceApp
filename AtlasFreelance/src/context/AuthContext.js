// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

// 1. Kankhl9o l-"Sandou9" (Context)
// Kandiro 'null' f l-bdya 7it mazal ma3ndna ta data
const AuthContext = createContext(null);

// 2. Hada howa "L-Ghlaya" (Provider Component)
// 'children' howa l-App dialek kamla li ghadi t-ghllfha b had Provider
export function AuthProvider({ children }) {
  
  // 3. L-State: Hna fin mkhbya l-ma3louma "Chkoun connecté?"
  // f l-bdya: user = null (ya3ni ma mconnecté 7ed)
  const [user, setUser] = useState(null);

  // --- Fonctions d'action (Daba ghir Fake / Simulation) ---

  // Bach ndkhlo b sifa dyal Admin
  function loginAsAdmin() {
    setUser({ email: 'admin@atlas.com', role: 'admin' });
  }

  // Bach ndkhlo b sifa dyal User 3adi
  function loginAsUser() {
    setUser({ email: 'user@atlas.com', role: 'user' });
  }

  // Bach ndiro Déconnexion (Kanrdo user = null)
  function logout() {
    setUser(null);
  }

  // 4. Return: Hna kan-fourniw (kan3tiw) l-Data l l-App
  // value={{...}} : Hna fin jm3na l-variable o les fonctions f pack wa7d
  return (
    <AuthContext.Provider value={{ user, loginAsAdmin, loginAsUser, logout }}>
      {children} 
      {/* 'children' hna hiya <RootNavigator /> li f App.js */}
    </AuthContext.Provider>
  );
}

// 5. Custom Hook: Raccourci sahal
// Blast ma tb9a tktb "useContext(AuthContext)" f kol blassa,
// kat3yt ghir 3la "useAuth()"
export function useAuth() {
  return useContext(AuthContext);
}