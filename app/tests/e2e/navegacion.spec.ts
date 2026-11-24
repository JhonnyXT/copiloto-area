import { test, expect } from "@playwright/test";

/**
 * Carga básica de las 4 pantallas y la franja "Datos de ejemplo", que debe
 * verse siempre y no tener botón para cerrarla — PRODUCT.md "Operating Context".
 */
test.describe("Navegación y franja de datos de ejemplo", () => {
  const paginas = [
    { ruta: "/", titulo: "Resumen de la semana" },
    { ruta: "/indicadores/costo-onza", titulo: "Costo por onza" },
    { ruta: "/informes", titulo: /Informe semanal/ },
    { ruta: "/documentos", titulo: "Pregúntale a tus documentos" },
  ];

  for (const { ruta, titulo } of paginas) {
    test(`${ruta} carga y muestra la franja de datos de ejemplo`, async ({ page }) => {
      await page.goto(ruta);
      await expect(page.getByRole("heading", { name: titulo, level: 1 })).toBeVisible();
      await expect(page.getByText("Estás viendo datos de ejemplo")).toBeVisible();
    });
  }

  test("la barra lateral navega entre las 4 secciones", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Indicadores" }).click();
    await expect(page).toHaveURL(/\/indicadores\//);
    await page.getByRole("link", { name: "Informes" }).click();
    await expect(page).toHaveURL("/informes");
    await page.getByRole("link", { name: "Documentos" }).click();
    await expect(page).toHaveURL("/documentos");
    await page.getByRole("link", { name: "Resumen" }).click();
    await expect(page).toHaveURL("/");
  });
});
