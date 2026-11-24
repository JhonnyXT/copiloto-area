import { test, expect } from "@playwright/test";

test("hacer clic en una cita abre el documento en la página correcta", async ({ page }) => {
  await page.goto("/documentos");

  await expect(page.getByText("Procedimiento de ventilación (ejemplo)").first()).toBeVisible();
  await expect(page.getByText("Página 7 de 18")).toBeVisible();

  await page.getByRole("button", { name: "Ver fuente 2" }).first().click();
  await expect(page.getByText("Página 3 de 9")).toBeVisible();
  await expect(page.getByText("Instructivo de reporte de incidentes (ejemplo)").first()).toBeVisible();
});

test("una pregunta sin respuesta dice que no se encontró, en vez de inventar", async ({ page }) => {
  await page.goto("/documentos");
  await expect(page.getByText("No encontré esto en tus documentos")).toBeVisible();
  await expect(page.getByText("Plan de formación 2026 (ejemplo)").first()).toBeVisible();
});
