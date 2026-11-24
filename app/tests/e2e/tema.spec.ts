import { test, expect, type Page } from "@playwright/test";

/** En escritorio el control vive en la barra lateral (segmentado); en
 * celular la barra lateral se oculta y el icono compacto vive en la barra
 * superior — ambos deben existir y funcionar. */
async function abrirModoOscuro(page: Page) {
  const esAngosto = (page.viewportSize()?.width ?? 1280) < 768;
  const boton = esAngosto
    ? page.getByRole("button", { name: "Cambiar a modo oscuro" })
    : page.getByRole("button", { name: "Oscuro" });
  await boton.click();
}

async function abrirModoClaro(page: Page) {
  const esAngosto = (page.viewportSize()?.width ?? 1280) < 768;
  const boton = esAngosto
    ? page.getByRole("button", { name: "Cambiar a modo claro" })
    : page.getByRole("button", { name: "Claro" });
  await boton.click();
}

test("el selector de tema cambia a oscuro y persiste después de recargar", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).not.toHaveClass(/dark/);

  await abrirModoOscuro(page);
  await expect(html).toHaveClass(/dark/);

  await page.reload();
  await expect(html).toHaveClass(/dark/);

  await abrirModoClaro(page);
  await expect(html).not.toHaveClass(/dark/);
});
