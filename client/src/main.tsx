import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Proper error handling - log errors but don't suppress them completely
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

window.addEventListener('error', (event) => {
  console.error('Runtime error:', event.error);
});

createRoot(document.getElementById("root")!).render(<App />);

// TEMPORARIAMENTE DESABILITADO: Service Worker estava causando problemas de cache
// Desregistrar qualquer Service Worker existente
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach(registration => {
      registration.unregister();
      console.log('🗑️ Service Worker removido:', registration.scope);
    });
  });
}
