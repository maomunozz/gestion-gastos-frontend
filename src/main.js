import { getToken, clearToken } from "../src/utils/auth.js";
import { apiFetch } from "../src/utils/api.js";

// Cerrar sesión
document.getElementById("logout").addEventListener("click", () => {
  clearToken();
  alert("Has cerrado sesión");
  window.location.href = "login.html";
});

// Verificar token
async function verifyToken() {
  const token = getToken();
  if (!token) return redirectToLogin();

  try {
    await apiFetch("/auth/verify", "GET", null, token);
  } catch {
    clearToken();
    redirectToLogin();
  }
}

function redirectToLogin() {
  alert("Debes iniciar sesión.");
  window.location.href = "login.html";
}

verifyToken();
