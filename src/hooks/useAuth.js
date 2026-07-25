/**
 * src/hooks/useAuth.js
 * ----------------------------------------------------------------------------
 * Thin convenience re-export so components import `useAuth` from `hooks/`
 * consistently with every other hook, instead of reaching into `context/`
 * directly. Keeps the import surface uniform across the app.
 * ----------------------------------------------------------------------------
 */
import { useAuthContext } from "../context/AuthContext";

export default function useAuth() {
  return useAuthContext();
}
