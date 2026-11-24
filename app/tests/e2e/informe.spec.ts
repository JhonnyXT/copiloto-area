import { test, expect } from "@playwright/test";

test("las secciones del informe se ocultan y muestran, y el contador de cifras cambia", async ({ page }) => {
  await page.goto("/informes");

  await expect(page.getByRole("heading", { name: "Costos", exact: true })).toBeVisible();
  const contador = page.getByText(/\d+ verificadas/);
  const textoInicial = await contador.textContent();

  await page.getByRole("switch", { name: "Costos" }).click();
  await expect(page.getByRole("heading", { name: "Costos", exact: true })).toBeHidden();
  await expect(contador).not.toHaveText(textoInicial ?? "");

  await page.getByRole("switch", { name: "Costos" }).click();
  await expect(page.getByRole("heading", { name: "Costos", exact: true })).toBeVisible();
  await expect(contador).toHaveText(textoInicial ?? "");
});

test("el informe muestra la fuente de una cifra al pasar el cursor", async ({ page }) => {
  await page.goto("/informes");
  const cifra = page.getByText("1.284 oz", { exact: true });
  await expect(cifra).toHaveAttribute("title", /indicadores_s47_ejemplo/);
});
