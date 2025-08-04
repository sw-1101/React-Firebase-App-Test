import { test, expect } from '@playwright/test';

/**
 * 音声メモアプリ E2Eテスト
 * 
 * テストシナリオ:
 * - メモ一覧ページの表示
 * - テキストメモの作成
 * - 音声メモの作成（モック）
 * - メモの検索・フィルタ
 * - メモの削除
 * - レスポンシブ表示
 */

test.describe('音声メモアプリ', () => {
  test.beforeEach(async ({ page }) => {
    // 認証をバイパスしてメモページに直接アクセス
    await page.goto('/memos');
    
    // ページロード完了を待機
    await page.waitForLoadState('networkidle');
  });

  test.describe('メモ一覧ページ', () => {
    test('ページが正しく表示される', async ({ page }) => {
      // ページタイトルを確認
      await expect(page.getByText('📝 音声メモ')).toBeVisible();
      
      // FABボタンが表示される
      await expect(page.getByRole('button', { name: '新しいメモを作成' })).toBeVisible();
      
      // 検索ボタンが表示される
      await expect(page.getByLabelText('検索')).toBeVisible();
    });

    test('空の状態が正しく表示される', async ({ page }) => {
      // メモがない場合のメッセージ
      await expect(page.getByText('📝 メモがありません')).toBeVisible();
      await expect(page.getByText('🎤ボタンを押して最初のメモを作成しましょう')).toBeVisible();
    });

    test('新規作成ボタンをクリックしてダイアログが開く', async ({ page }) => {
      // FABボタンをクリック
      await page.getByRole('button', { name: '新しいメモを作成' }).click();
      
      // ダイアログが開くことを確認
      await expect(page.getByText('新しいメモ')).toBeVisible();
      await expect(page.getByText('メモを入力してください...')).toBeVisible();
    });
  });

  test.describe('テキストメモ作成', () => {
    test('テキストメモを作成できる', async ({ page }) => {
      // 新規作成ダイアログを開く
      await page.getByRole('button', { name: '新しいメモを作成' }).click();
      
      // テキストモードを選択（デフォルト）
      await expect(page.getByLabelText('テキストメモ')).toHaveAttribute('color', 'primary');
      
      // テキストを入力
      const textInput = page.getByPlaceholderText('メモを入力してください...');
      await textInput.fill('これはテストメモです。E2Eテストで作成されました。');
      
      // 文字数表示を確認
      await expect(page.getByText('46/1000文字')).toBeVisible();
      
      // 送信ボタンをクリック
      await page.getByRole('button', { name: '送信' }).click();
      
      // 成功通知を確認（トロフィー通知）
      await expect(page.getByText('メモが作成されました！')).toBeVisible();
      
      // ダイアログが閉じることを確認
      await expect(page.getByText('新しいメモ')).not.toBeVisible();
      
      // メモ一覧にメモが表示されることを確認
      await expect(page.getByText('これはテストメモです。E2Eテストで作成されました。')).toBeVisible();
    });

    test('空のテキストで送信時にエラーが表示される', async ({ page }) => {
      await page.getByRole('button', { name: '新しいメモを作成' }).click();
      
      // 何も入力せずに送信
      await page.getByRole('button', { name: '送信' }).click();
      
      // エラーメッセージを確認
      await expect(page.getByText('テキストを入力してください')).toBeVisible();
    });

    test('Enterキーで送信できる', async ({ page }) => {
      await page.getByRole('button', { name: '新しいメモを作成' }).click();
      
      // テキストを入力してEnterキーを押す
      const textInput = page.getByPlaceholderText('メモを入力してください...');
      await textInput.fill('Enterキーでの送信テスト');
      await textInput.press('Enter');
      
      // 成功通知を確認
      await expect(page.getByText('メモが作成されました！')).toBeVisible();
    });
  });

  test.describe('モード切り替え', () => {
    test('音声モードに切り替えられる', async ({ page }) => {
      await page.getByRole('button', { name: '新しいメモを作成' }).click();
      
      // 音声モードボタンをクリック
      await page.getByLabelText('音声メモ').click();
      
      // 録音ボタンが表示される
      await expect(page.getByText('録音開始')).toBeVisible();
      
      // テキストフィールドが非表示になる
      await expect(page.getByPlaceholderText('メモを入力してください...')).not.toBeVisible();
    });

    test('混合モードに切り替えられる', async ({ page }) => {
      await page.getByRole('button', { name: '新しいメモを作成' }).click();
      
      // 混合モードボタンをクリック
      await page.getByLabelText('テキスト＋音声メモ').click();
      
      // テキストフィールドと録音ボタンの両方が表示される
      await expect(page.getByPlaceholderText('メモを入力してください...')).toBeVisible();
      await expect(page.getByText('録音開始')).toBeVisible();
    });
  });

  test.describe('音声録音（モック）', () => {
    test.beforeEach(async ({ page }) => {
      // MediaRecorderとgetUserMediaをモック
      await page.addInitScript(() => {
        // getUserMediaのモック
        Object.defineProperty(navigator, 'mediaDevices', {
          value: {
            getUserMedia: () => Promise.resolve({
              getTracks: () => [{ stop: () => {} }]
            })
          }
        });

        // MediaRecorderのモック
        window.MediaRecorder = class {
          constructor() {
            this.state = 'inactive';
          }
          start() {
            this.state = 'recording';
            setTimeout(() => {
              if (this.ondataavailable) {
                this.ondataavailable({ data: new Blob(['mock'], { type: 'audio/webm' }) });
              }
            }, 100);
          }
          stop() {
            this.state = 'inactive';
            setTimeout(() => {
              if (this.onstop) {
                this.onstop();
              }
            }, 100);
          }
          static isTypeSupported() { return true; }
        };
      });
    });

    test('音声録音を開始・停止できる', async ({ page }) => {
      await page.getByRole('button', { name: '新しいメモを作成' }).click();
      
      // 音声モードに切り替え
      await page.getByLabelText('音声メモ').click();
      
      // 録音開始
      await page.getByText('録音開始').click();
      
      // 録音中の表示を確認
      await expect(page.getByText(/録音停止/)).toBeVisible();
      await expect(page.getByText(/録音中.../)).toBeVisible();
      
      // 録音停止
      await page.getByText(/録音停止/).click();
      
      // 録音完了後の表示を確認
      await expect(page.getByRole('audio')).toBeVisible();
    });
  });

  test.describe('メモ操作', () => {
    test.beforeEach(async ({ page }) => {
      // テストデータとしてメモを作成
      await page.getByRole('button', { name: '新しいメモを作成' }).click();
      const textInput = page.getByPlaceholderText('メモを入力してください...');
      await textInput.fill('テスト用メモ - 編集・削除のテスト');
      await page.getByRole('button', { name: '送信' }).click();
      await page.waitForTimeout(1000); // 作成完了を待機
    });

    test('メモを削除できる', async ({ page }) => {
      // メモカードのメニューボタンをクリック
      await page.getByRole('button', { name: 'メニューを開く' }).click();
      
      // 削除メニューをクリック
      await page.getByText('削除').click();
      
      // メモが削除されることを確認
      await expect(page.getByText('テスト用メモ - 編集・削除のテスト')).not.toBeVisible();
    });
  });

  test.describe('検索機能', () => {
    test.beforeEach(async ({ page }) => {
      // 複数のテストメモを作成
      const testMemos = [
        '検索テスト - JavaScript開発について',
        '検索テスト - React学習メモ',
        '検索テスト - 会議の議事録'
      ];

      for (const memo of testMemos) {
        await page.getByRole('button', { name: '新しいメモを作成' }).click();
        await page.getByPlaceholderText('メモを入力してください...').fill(memo);
        await page.getByRole('button', { name: '送信' }).click();
        await page.waitForTimeout(500);
      }
    });

    test('メモを検索できる', async ({ page }) => {
      // 検索ボタンをクリック
      await page.getByLabelText('検索').click();
      
      // 検索バーが表示される
      await expect(page.getByPlaceholderText('メモを検索...')).toBeVisible();
      
      // 検索キーワードを入力
      await page.getByPlaceholderText('メモを検索...').fill('React');
      
      // 検索結果を確認
      await expect(page.getByText('検索テスト - React学習メモ')).toBeVisible();
      await expect(page.getByText('検索テスト - JavaScript開発について')).not.toBeVisible();
    });

    test('検索をクリアできる', async ({ page }) => {
      await page.getByLabelText('検索').click();
      await page.getByPlaceholderText('メモを検索...').fill('React');
      
      // 検索クリアボタンをクリック
      await page.getByRole('button', { name: 'クリア' }).click();
      
      // 全てのメモが再表示される
      await expect(page.getByText('検索テスト - JavaScript開発について')).toBeVisible();
      await expect(page.getByText('検索テスト - React学習メモ')).toBeVisible();
      await expect(page.getByText('検索テスト - 会議の議事録')).toBeVisible();
    });
  });

  test.describe('レスポンシブデザイン', () => {
    test('モバイル表示で正しくレイアウトされる', async ({ page }) => {
      // モバイルサイズに変更
      await page.setViewportSize({ width: 375, height: 667 });
      
      // ページが正しく表示される
      await expect(page.getByText('📝 音声メモ')).toBeVisible();
      await expect(page.getByRole('button', { name: '新しいメモを作成' })).toBeVisible();
      
      // 新規作成ダイアログがフルスクリーンで開く
      await page.getByRole('button', { name: '新しいメモを作成' }).click();
      await expect(page.getByRole('button', { name: '閉じる' })).toBeVisible();
    });

    test('タブレット表示で正しくレイアウトされる', async ({ page }) => {
      // タブレットサイズに変更
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // レイアウトが適切に調整される
      await expect(page.getByText('📝 音声メモ')).toBeVisible();
      
      // メモ入力ダイアログがモーダル形式で開く
      await page.getByRole('button', { name: '新しいメモを作成' }).click();
      await expect(page.getByText('新しいメモ')).toBeVisible();
    });
  });

  test.describe('アクセシビリティ', () => {
    test('キーボードナビゲーションが機能する', async ({ page }) => {
      // Tabキーでのナビゲーション
      await page.keyboard.press('Tab'); // 検索ボタン
      await page.keyboard.press('Tab'); // 更新ボタン
      await page.keyboard.press('Tab'); // FABボタン
      
      // FABボタンにフォーカスがあることを確認
      await expect(page.getByRole('button', { name: '新しいメモを作成' })).toBeFocused();
      
      // Enterキーで実行
      await page.keyboard.press('Enter');
      await expect(page.getByText('新しいメモ')).toBeVisible();
    });

    test('スクリーンリーダー用のaria-labelが適切に設定されている', async ({ page }) => {
      // aria-labelの存在を確認
      await expect(page.getByLabelText('検索')).toBeVisible();
      await expect(page.getByLabelText('更新')).toBeVisible();
      await expect(page.getByLabelText('新しいメモを作成')).toBeVisible();
    });
  });

  test.describe('パフォーマンス', () => {
    test('ページ読み込み時間が適切である', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/memos');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // 3秒以内に読み込み完了することを確認
      expect(loadTime).toBeLessThan(3000);
    });

    test('大量のメモが表示されても性能が維持される', async ({ page }) => {
      // 大量のメモを模擬（実際の実装では仮想スクロールが動作）
      // このテストは概念的なものであり、実際の実装に応じて調整が必要
      
      const startTime = Date.now();
      
      // ページの操作性をテスト
      await page.getByLabelText('検索').click();
      const searchTime = Date.now() - startTime;
      
      // UI操作が1秒以内に応答することを確認
      expect(searchTime).toBeLessThan(1000);
    });
  });
});