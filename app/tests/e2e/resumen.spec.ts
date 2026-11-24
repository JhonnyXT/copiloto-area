import { test, expect } from "@playwright/test";

test("la pestaña de indicador cambia el título del gráfico de tendencia", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Producción semanal de tu área" })).toBeVisible();

  await page.getByRole("tab", { name: /Costo por onza/ }).click();
  await expect(page.getByRole("heading", { name: "Costo por onza" })).toBeVisible();

  await page.getByRole("tab", { name: /Mantenimiento preventivo/ }).click();
  await expect(page.getByRole("heading", { name: "Cumplimiento del mantenimiento preventivo" })).toBeVisible();
});

test("el tooltip de la tendencia muestra la cifra de la semana al pasar el cursor", async ({ page, isMobile }) => {
  test.skip(!!isMobile, "El hover no aplica en pantallas táctiles");
  await page.goto("/");
  const grafico = page.getByRole("img", { name: /Tendencia de \d+ semanas/ });
  const caja = await grafico.boundingBox();
  if (!caja) throw new Error("No se encontró el gráfico");
  await page.mouse.move(caja.x + caja.width * 0.8, caja.y + caja.height / 2);
  await expect(page.getByText(/frente a la meta/)).toBeVisible();
});

test("el enlace de una novedad lleva al detalle del indicador correcto", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Costo por onza 3,8 % sobre la meta").click();
  await expect(page).toHaveURL("/indicadores/costo-onza");
});
