import type { Meta, StoryObj } from '@storybook/react';
import { MemoInput } from './MemoInput';

const meta: Meta<typeof MemoInput> = {
  title: 'Components/Memo/MemoInput',
  component: MemoInput,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    mode: {
      control: { type: 'select' },
      options: ['text', 'audio', 'mixed']
    },
    placeholder: {
      control: 'text'
    },
    maxLength: {
      control: 'number'
    }
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px', padding: '20px' }}>
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof MemoInput>;

export const TextMode: Story = {
  args: {
    mode: 'text',
    placeholder: 'テキストメモを入力してください...',
    onSubmitSuccess: (memoId) => console.log('Success:', memoId),
    onSubmitError: (error) => console.log('Error:', error),
    onModeChange: (mode) => console.log('Mode changed:', mode)
  }
};

export const AudioMode: Story = {
  args: {
    mode: 'audio',
    onSubmitSuccess: (memoId) => console.log('Success:', memoId),
    onSubmitError: (error) => console.log('Error:', error),
    onModeChange: (mode) => console.log('Mode changed:', mode)
  }
};

export const MixedMode: Story = {
  args: {
    mode: 'mixed',
    placeholder: 'テキストと音声の両方を入力できます...',
    onSubmitSuccess: (memoId) => console.log('Success:', memoId),
    onSubmitError: (error) => console.log('Error:', error),
    onModeChange: (mode) => console.log('Mode changed:', mode)
  }
};

export const CustomLength: Story = {
  args: {
    mode: 'text',
    placeholder: '最大100文字まで入力可能...',
    maxLength: 100,
    onSubmitSuccess: (memoId) => console.log('Success:', memoId),
    onSubmitError: (error) => console.log('Error:', error)
  }
};