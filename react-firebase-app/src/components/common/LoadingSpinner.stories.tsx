import type { Meta, StoryObj } from '@storybook/react-vite'
import LoadingSpinner from './LoadingSpinner'

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Common/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'Loading message to display',
    },
    size: {
      control: { type: 'range', min: 20, max: 100, step: 10 },
      description: 'Size of the loading spinner',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    message: 'Loading...',
    size: 40,
  },
}

export const WithCustomMessage: Story = {
  args: {
    message: 'データを読み込み中...',
    size: 40,
  },
}

export const Large: Story = {
  args: {
    message: 'Loading...',
    size: 60,
  },
}

export const Small: Story = {
  args: {
    message: 'Loading...',
    size: 24,
  },
}

export const WithoutMessage: Story = {
  args: {
    size: 40,
  },
}