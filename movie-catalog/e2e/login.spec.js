import { test, expect } from '@playwright/test'

test('usuario no autenticado es redirigido al login', async ({ page }) => {
  await page.goto('/catalog')
  await expect(page).toHaveURL(/login/)
})

test('la página de login carga correctamente', async ({ page }) => {
  await page.goto('/login')
  await expect(page.locator('input[type="email"]')).toBeVisible()
  await expect(page.locator('input[type="password"]')).toBeVisible()
})