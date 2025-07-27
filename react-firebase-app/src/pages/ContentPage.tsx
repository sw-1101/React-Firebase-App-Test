import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Alert,
  Snackbar,
  Paper,
  Tab,
  Tabs,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import MultimodalInput from '../components/multimodal/MultimodalInput';
import ContentList from '../components/content/ContentList';
import { processMultimodalInput } from '../services/geminiService';
import type { ProcessedContent } from '../services/geminiService';
import {
  saveContent,
  getUserContents,
  deleteContent,
  updateContent,
  testFirestoreConnection,
} from '../services/contentService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ContentPage: React.FC = () => {
  const { state } = useAuth();
  const user = state.user;
  const [contents, setContents] = useState<ProcessedContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [tabValue, setTabValue] = useState(0);

  // 初期データ読み込み
  useEffect(() => {
    if (user) {
      // Firestore接続テスト
      testFirestoreConnection().then(isConnected => {
        if (isConnected) {
          loadContents();
        } else {
          setError('データベースへの接続に失敗しました。Firebase設定を確認してください。');
        }
      });
    }
  }, [user]);

  // コンテンツ一覧を読み込み
  const loadContents = async () => {
    if (!user) {
      console.log('loadContents: No user found');
      return;
    }

    try {
      setLoading(true);
      setError(''); // エラーをクリア
      console.log('loadContents: Loading contents for user:', user.uid);
      
      const userContents = await getUserContents(user.uid);
      console.log('loadContents: Loaded', userContents.length, 'contents');
      
      setContents(userContents);
      
      if (userContents.length === 0) {
        console.log('loadContents: No contents found for this user');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'コンテンツの読み込みに失敗しました';
      setError(errorMessage);
      console.error('Error loading contents:', err);
    } finally {
      setLoading(false);
    }
  };

  // マルチモーダル入力の処理
  const handleMultimodalSubmit = async (data: {
    text: string;
    files: File[];
    audioBlob?: Blob;
  }) => {
    if (!user) {
      setError('ログインが必要です');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Gemini APIで処理
      const processedContent = await processMultimodalInput(data);

      // Firestoreに保存
      const contentId = await saveContent(processedContent, user.uid);

      // ローカル状態を更新
      const savedContent = { ...processedContent, id: contentId };
      setContents(prev => [savedContent, ...prev]);

      setSuccess('テストが正常に完了し、結果が保存されました');
      setTabValue(1); // テスト結果一覧タブに切り替え

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'コンテンツの処理に失敗しました';
      setError(errorMessage);
      console.error('Error processing content:', err);
    } finally {
      setLoading(false);
    }
  };

  // コンテンツ更新
  const handleContentUpdate = async (contentId: string, updates: Partial<ProcessedContent>) => {
    try {
      await updateContent(contentId, updates);
      setContents(prev =>
        prev.map(content =>
          content.id === contentId ? { ...content, ...updates } : content
        )
      );
      setSuccess('コンテンツが更新されました');
    } catch (err) {
      setError('コンテンツの更新に失敗しました');
      console.error('Error updating content:', err);
    }
  };

  // コンテンツ削除
  const handleContentDelete = async (contentId: string) => {
    try {
      await deleteContent(contentId);
      setContents(prev => prev.filter(content => content.id !== contentId));
      setSuccess('コンテンツが削除されました');
    } catch (err) {
      setError('コンテンツの削除に失敗しました');
      console.error('Error deleting content:', err);
    }
  };

  // タブ変更
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // エラー・成功メッセージのクリア
  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  // ローディング中の表示
  if (state.loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography>読み込み中...</Typography>
        </Box>
      </Container>
    );
  }

  // 未ログインの場合
  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          この機能を使用するにはログインが必要です。
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        音声とアップロードテスト
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        音声録音、ファイルアップロード、テキスト入力のマルチモーダル機能をテストできます
      </Typography>

      <Paper elevation={1} sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="content tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="新規テスト" id="content-tab-0" />
          <Tab label={`テスト結果 (${contents.length})`} id="content-tab-1" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <MultimodalInput
            onSubmit={handleMultimodalSubmit}
            loading={loading}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ContentList
            contents={contents}
            onContentUpdate={handleContentUpdate}
            onContentDelete={handleContentDelete}
            onRefresh={loadContents}
          />
        </TabPanel>
      </Paper>

      {/* スナックバー */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContentPage;