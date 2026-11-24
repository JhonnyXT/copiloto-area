import { defineConfig, devices } from "@playwright/test";

// 3100 quedó ocupado por un proceso viejo, ajeno a este proyecto, que este
// entorno no puede matar sin privilegios de administrador — se usa otro
// puerto para no toparse con él de nuevo.
const PUERTO = 3141;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PUERTO}`,
    trace: "on-first-retry",
    actionTimeout: 10_000,
  },
  // `next dev` compila cada ruta la primera vez que se visita: más lento
  // que la build de producción que se usó al escribir estas pruebas.
  expect: { timeout: 10_000 },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // "Pixel 7" usa Chromium (no WebKit): este entorno no puede instalar los
    // paquetes del sistema que WebKit necesita sin una contraseña de sudo.
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    // Build de producción, no `next dev`: en dev, Turbopack puede forzar una
    // recarga completa de la página al compilar bajo demanda tras el primer
    // clic, lo que reinicia el estado de React a mitad de una prueba.
    command: `npx next start -p ${PUERTO}`,
    url: `http://localhost:${PUERTO}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: { E2E_BYPASS_AUTH: "solo-para-playwright-nunca-en-produccion" },
  },
});
