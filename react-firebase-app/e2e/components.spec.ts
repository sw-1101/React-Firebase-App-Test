import { test, expect } from '@playwright/test'

test.describe('Component Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should display loading spinner', async ({ page }) => {
    // Trigger a loading state by attempting login
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button:has-text("ログイン")')
    
    // Check if loading indicator appears briefly
    await expect(page.locator('[role="progressbar"]')).toBeVisible({ timeout: 2000 })
  })

  test('should display error messages appropriately', async ({ page }) => {
    // Fill invalid credentials
    await page.fill('input[type="email"]', 'nonexistent@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button:has-text("ログイン")')
    
    // Should show error message
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 5000 })
  })

  test('should handle form validation', async ({ page }) => {
    // Test email validation
    await page.fill('input[type="email"]', 'invalid')
    await page.blur('input[type="email"]')
    await expect(page.locator('text=正しいメールアドレスを入力してください')).toBeVisible()
    
    // Test password validation
    await page.fill('input[type="password"]', '123')
    await page.blur('input[type="password"]')
    await expect(page.locator('text=パスワードは6文字以上で入力してください')).toBeVisible()
  })
})