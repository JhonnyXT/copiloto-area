import { test, expect } from "@playwright/test";

test("el selector de tema cambia a oscuro y persiste después de recargar", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).not.toHaveClass(/dark/);

  await page.getByRole("button", { name: "Modo oscuro" }).click();
  await expect(html).toHaveClass(/dark/);

  await page.reload();
  await expect(html).toHaveClass(/dark/);

  await page.getByRole("button", { name: "Modo claro" }).click();
  await expect(html).not.toHaveClass(/dark/);
});
