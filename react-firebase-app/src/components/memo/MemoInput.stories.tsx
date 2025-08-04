import type { Meta, StoryObj } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { within, userEvent, expect } from '@storybook/test';
import { MemoInput } from './MemoInput';

// モック設定
// const mockMemoContext = {
//   createMemo: async (data: any) => {
//     action('createMemo')(data);
//     return 'mock-memo-id';
//   }
// };

// const mockTrophyNotification = {
//   showSuccessNotification: action('showSuccessNotification')
// };

// ストーリーメタデータ
const meta: Meta<typeof MemoInput> = {
  title: 'Components/Memo/MemoInput',
  component: MemoInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
音声メモ入力コンポーネント

## 機能
- テキスト、音声、混合モードに対応
- リアルタイム音声録音
- 音声文字起こし統合
- プログレス表示
- バリデーション
- アクセシビリティ対応

## 使用例
\`\`\`tsx
<MemoInput
  mode="text"
  placeholder="メモを入力してください..."
  onSubmitSuccess={(memoId) => console.log('作成完了:', memoId)}
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    mode: {
      control: { type: 'select' },
      options: ['text', 'audio', 'mixed'],
      description: '入力モード'
    },
    placeholder: {
      control: { type: 'text' },
      description: 'プレースホルダーテキスト'
    },
    maxLength: {
      control: { type: 'number' },
      description: '最大文字数'
    },
    onSubmitSuccess: { description: 'Submit success callback' },
    onSubmitError: { description: 'Submit error callback' },
    onModeChange: { description: 'Mode change callback' }
  },
  decorators: [
    (Story) => {
      // モックを提供するデコレータ
      return (
        <div style={{ width: '500px', padding: '20px' }}>
          <Story />
        </div>
      );
    }
  ]
};

export default meta;
type Story = StoryObj<typeof MemoInput>;

// 基本ストーリー
export const Default: Story = {
  args: {
    mode: 'text',
    placeholder: 'メモを入力してください...',
    maxLength: 1000
  }
};

export const TextMode: Story = {
  args: {
    mode: 'text',
    placeholder: 'テキストメモを入力...',
    maxLength: 500
  },
  parameters: {
    docs: {
      description: {
        story: 'テキストのみの入力モード。キーボードからの文字入力に対応。'
      }
    }
  }
};

export const AudioMode: Story = {
  args: {
    mode: 'audio'
  },
  parameters: {
    docs: {
      description: {
        story: '音声録音専用モード。マイクからの音声入力と文字起こしに対応。'
      }
    }
  }
};

export const MixedMode: Story = {
  args: {
    mode: 'mixed',
    placeholder: 'テキストと音声の両方を入力できます...'
  },
  parameters: {
    docs: {
      description: {
        story: 'テキストと音声の両方を組み合わせたメモ作成モード。'
      }
    }
  }
};

// インタラクション付きストーリー
export const TextInput: Story = {
  args: {
    mode: 'text',
    placeholder: 'ここにテキストを入力...'
  },
  // play: async ({ canvasElement }) => {
  //   const canvas = within(canvasElement);
  //   
  //   // テキストフィールドを見つけて入力
  //   const textField = canvas.getByPlaceholderText('ここにテキストを入力...');
  //   await userEvent.type(textField, 'これはテストメモです。詳細な内容を記載します。', {
  //     delay: 50
  //   });
  //   
  //   // 文字数表示を確認
  //   await expect(canvas.getByText(/\/1000文字/)).toBeInTheDocument();
  // },
  parameters: {
    docs: {
      description: {
        story: 'バリデーションエラーのデモ。空のフォーム送信時のエラー表示を確認できます。'
      }
    }
  }
};

export const SuccessfulSubmit: Story = {
  args: {
    mode: 'text',
    placeholder: '成功例のテキスト入力...'
  },
  // play: async ({ canvasElement }) => {
  //   const canvas = within(canvasElement);
  //   
  //   // テキストを入力
  //   const textField = canvas.getByPlaceholderText('成功例のテキスト入力...');
  //   await userEvent.type(textField, '送信テストメモ');
  //   
  //   // 送信ボタンをクリック
  //   const submitButton = canvas.getByRole('button', { name: /送信/i });
  //   await userEvent.click(submitButton);
  //   
  //   // 送信中状態を確認
  //   await expect(canvas.getByText('送信中...')).toBeInTheDocument();
  // },
  parameters: {
    docs: {
      description: {
        story: 'メモ送信成功例のデモ。送信プロセスとローディング状態を確認できます。'
      }
    }
  }
};

// エラー状態のストーリー
export const NetworkError: Story = {
  args: {
    mode: 'text'
  },
  render: (args) => {
    // エラーを模擬するハンドラー
    const handleSubmitError = (error: Error) => {
      console.log('onSubmitError', error);
    };
    
    return (
      <MemoInput 
        {...args} 
        onSubmitError={handleSubmitError}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'ネットワークエラー時の表示例。エラーハンドリングとユーザー通知を確認できます。'
      }
    }
  }
};

// 処理進捗表示のストーリー
export const ProcessingProgress: Story = {
  args: {
    mode: 'audio'
  },
  parameters: {
    docs: {
      description: {
        story: '音声処理進捗表示のデモ。アップロード、文字起こし、保存の各段階を表示します。'
      }
    }
  }
};

// アクセシビリティテスト用ストーリー
export const AccessibilityTest: Story = {
  args: {
    mode: 'mixed'
  },
  // play: async ({ canvasElement }) => {
  //   const canvas = within(canvasElement);
  //   
  //   // キーボードナビゲーションテスト
  //   await userEvent.tab(); // モードボタンにフォーカス
  //   await userEvent.tab(); // 次のモードボタンにフォーカス
  //   await userEvent.tab(); // 次のモードボタンにフォーカス
  //   await userEvent.tab(); // テキストフィールドにフォーカス
  //   
  //   const textField = canvas.getByPlaceholderText('メモを入力してください...');
  //   await expect(textField).toHaveFocus();
  //   
  //   // Enterキーでの送信テスト
  //   await userEvent.type(textField, 'キーボード入力テスト');
  //   await userEvent.keyboard('{Enter}');
  // },
  parameters: {
    docs: {
      description: {
        story: 'アクセシビリティテスト用ストーリー。キーボードナビゲーションやスクリーンリーダー対応を確認できます。'
      }
    }
  }
};

// レスポンシブデザインテスト
export const MobileView: Story = {
  args: {
    mode: 'mixed'
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'モバイル表示でのレイアウト確認。小さい画面での操作性をテストできます。'
      }
    }
  }
};

export const TabletView: Story = {
  args: {
    mode: 'mixed'
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'タブレット表示でのレイアウト確認。中間サイズ画面での表示を確認できます。'
      }
    }
  }
};

// カスタマイズ例
export const CustomStyling: Story = {
  args: {
    mode: 'text',
    placeholder: 'カスタムスタイルのメモ入力...',
    maxLength: 200
  },
  decorators: [
    (Story) => (
      <div 
        style={{ 
          width: '400px', 
          padding: '24px',
          backgroundColor: '#f5f5f5',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <h3 style={{ marginTop: 0, color: '#333' }}>カスタムメモフォーム</h3>
        <Story />
      </div>
    )
  ],
  parameters: {
    docs: {
      description: {
        story: 'カスタムスタイリング例。外部コンテナでのスタイル適用例を確認できます。'
      }
    }
  }
};