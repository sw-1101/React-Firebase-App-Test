import type { TestRunnerConfig } from '@storybook/test-runner'
import { getStoryContext } from '@storybook/test-runner'

const config: TestRunnerConfig = {
  setup() {
    // Setup before all tests
  },

  async postVisit(page, context) {
    // Get the entire context of a story, including parameters, args, argTypes, etc.
    const storyContext = await getStoryContext(page, context)

    // Do not run accessibility tests on disabled stories
    if (storyContext.parameters?.a11y?.disable) {
      return
    }

    // Apply story-level a11y rules
    await page.evaluate(() => {
      // Add custom a11y checks if needed
    })
  },

  async preVisit(page, context) {
    // Set up global test conditions before visiting each story
    await page.setViewportSize({ width: 1024, height: 768 })
    
    // Skip tests for certain stories if needed
    if (context.title.includes('Example') || context.title.includes('skip')) {
      return false
    }
  },

  getHttpHeaders(url) {
    // Return custom headers for requests
    return {}
  },
}

export default config