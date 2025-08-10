import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'error', 'success'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'メッセージを送信',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'キャンセル',
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    children: '設定',
    variant: 'ghost',
  },
};

export const Error: Story = {
  args: {
    children: '削除',
    variant: 'error',
  },
};

export const Success: Story = {
  args: {
    children: '完了',
    variant: 'success',
  },
};

export const Small: Story = {
  args: {
    children: 'スモール',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'ラージボタン',
    size: 'lg',
  },
};

export const Loading: Story = {
  args: {
    children: '送信中...',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: '無効',
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: '全幅ボタン',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};