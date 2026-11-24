import { test, expect } from "@playwright/test";

const CIFRAS_COMPARTIDAS = [
  { indicador: "Producción de oro", slug: "produccion", valor: "1.284", enInforme: "1.284 oz" },
  { indicador: "Costo por onza", slug: "costo-onza", valor: "1.142", enInforme: "1.142 USD/oz" },
  { indicador: "Mantenimiento preventivo", slug: "mantenimiento", valor: "88", enInforme: "88 %" },
];

for (const { indicador, slug, valor, enInforme } of CIFRAS_COMPARTIDAS) {
  test(`${indicador} muestra la misma cifra en resumen, detalle e informe`, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("tab", { name: new RegExp(indicador) })).toContainText(valor);

    await page.goto(`/indicadores/${slug}`);
    await expect(page.getByRole("region", { name: "Cifras clave" })).toContainText(valor);

    await page.goto("/informes");
    await expect(page.getByText(enInforme, { exact: true })).toBeVisible();
  });
}

test("el desglose de costo suma lo mismo que el costo por onza y su aumento", async ({ page }) => {
  await page.goto("/indicadores/costo-onza");
  await expect(page.getByRole("heading", { name: "Qué explica el aumento de 42 USD/oz" })).toBeVisible();
  await expect(page.getByText("1.142 USD/oz", { exact: true })).toBeVisible();
  await expect(page.getByText("−4", { exact: true })).toBeVisible();
});
