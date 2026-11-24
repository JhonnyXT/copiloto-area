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

test("un aviso de atención lleva al detalle de su indicador", async ({ page }) => {
  await page.goto("/");
  const aviso = page.getByRole("region", { name: "Requiere tu atención" }).getByRole("link").first();
  const destino = await aviso.getAttribute("href");
  await aviso.click();
  await expect(page).toHaveURL(destino!);
});

test("el resumen cabe completo en un portátil, sin desplazarse", async ({ page, isMobile }) => {
  test.skip(!!isMobile, "En celular el resumen sí se desplaza");
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto("/");
  await expect(page.getByRole("region", { name: "Indicadores de otras áreas" })).toBeInViewport({ ratio: 1 });
  await expect(page.getByRole("button", { name: "Cerrar sesión" })).toBeInViewport({ ratio: 1 });
  const sobrante = await page.locator("main").evaluate((main) => main.scrollHeight - main.clientHeight);
  expect(sobrante).toBeLessThanOrEqual(0);
});

test("los números del eje se dibujan dentro del gráfico", async ({ page }) => {
  await page.goto("/");
  const panel = await page.getByRole("tabpanel").boundingBox();
  const marca = await page.getByRole("tabpanel").locator(".tabular > span.absolute").first().boundingBox();
  expect(marca!.x).toBeGreaterThanOrEqual(panel!.x);
  expect(marca!.x + marca!.width).toBeLessThanOrEqual(panel!.x + panel!.width);
});
