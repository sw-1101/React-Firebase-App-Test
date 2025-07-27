import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  Grid,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
// SelectChangeEvent型の定義
import {
  MoreVert,
  Delete,
  Edit,
  Search,
  FilterList,
  AudioFile,
  VideoFile,
  PictureAsPdf,
  TableChart,
  Image as ImageIcon,
} from '@mui/icons-material';
import type { ProcessedContent } from '../../services/geminiService';
import { searchContent } from '../../services/geminiService';
import AudioPlayer from './AudioPlayer';

interface ContentListProps {
  contents: ProcessedContent[];
  onContentUpdate: (contentId: string, updates: Partial<ProcessedContent>) => void;
  onContentDelete: (contentId: string) => void;
  onRefresh: () => void;
}

const ITEMS_PER_PAGE = 6;

const ContentList: React.FC<ContentListProps> = ({
  contents,
  onContentUpdate,
  onContentDelete,
  onRefresh,
}) => {
  const [filteredContents, setFilteredContents] = useState<ProcessedContent[]>(contents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedContent, setSelectedContent] = useState<ProcessedContent | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string>('');

  // カテゴリ一覧を取得
  const categories = ['all', ...Array.from(new Set(contents.map(c => c.category)))];

  // ファイルアイコンを取得
  const getFileIcon = (type: string) => {
    if (type.startsWith('audio/')) return <AudioFile fontSize="small" />;
    if (type.startsWith('video/')) return <VideoFile fontSize="small" />;
    if (type.startsWith('image/')) return <ImageIcon fontSize="small" />;
    if (type === 'application/pdf') return <PictureAsPdf fontSize="small" />;
    if (type.includes('excel') || type.includes('spreadsheet')) return <TableChart fontSize="small" />;
    return null;
  };

  // 検索実行
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredContents(contents);
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      const searchResults = await searchContent(searchQuery, contents);
      setFilteredContents(searchResults);
      setCurrentPage(1);
    } catch (err) {
      setError('検索に失敗しました');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // フィルタリング
  useEffect(() => {
    let filtered = contents;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(content => content.category === selectedCategory);
    }

    if (!searchQuery.trim()) {
      setFilteredContents(filtered);
    }
  }, [contents, selectedCategory, searchQuery]);

  // ページネーション
  const totalPages = Math.ceil(filteredContents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedContents = filteredContents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // メニューハンドラー
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, content: ProcessedContent) => {
    setAnchorEl(event.currentTarget);
    setSelectedContent(content);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContent(null);
  };

  const handleDelete = () => {
    if (selectedContent) {
      onContentDelete(selectedContent.id);
      handleMenuClose();
    }
  };

  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value as string);
    setCurrentPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        テスト結果一覧
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* 検索・フィルター */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="テスト結果を検索... (例: こんな感じのもの探してみて)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    startIcon={<Search />}
                  >
                    {isSearching ? '検索中...' : '検索'}
                  </Button>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>カテゴリ</InputLabel>
              <Select
                value={selectedCategory}
                label="カテゴリ"
                onChange={handleCategoryChange}
                startAdornment={<FilterList />}
              >
                <MenuItem value="all">すべて</MenuItem>
                {categories.filter(c => c !== 'all').map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              onClick={onRefresh}
              fullWidth
            >
              更新
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* コンテンツ一覧 */}
      <Grid container spacing={2}>
        {displayedContents.map((content) => (
          <Grid item xs={12} md={6} lg={4} key={content.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" component="h3" noWrap>
                    {content.summary.length > 30 ? `${content.summary.substring(0, 30)}...` : content.summary}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, content)}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {formatDate(content.timestamp)}
                </Typography>

                <Typography variant="body2" sx={{ mb: 2, minHeight: '3em' }}>
                  {content.processedText.length > 100 
                    ? `${content.processedText.substring(0, 100)}...` 
                    : content.processedText}
                </Typography>

                {/* ファイル情報 */}
                {content.files.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      添付ファイル:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {content.files.map((file, index) => (
                        <Chip
                          key={index}
                          icon={getFileIcon(file.type)}
                          label={file.name.length > 15 ? `${file.name.substring(0, 15)}...` : file.name}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* 音声再生・文字起こし */}
                {content.audioTranscript && (
                  <AudioPlayer
                    transcript={content.audioTranscript}
                    label="録音音声"
                  />
                )}

                {/* タグ */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  <Chip label={content.category} size="small" color="primary" />
                  {content.tags.slice(0, 3).map((tag, index) => (
                    <Chip key={index} label={tag} size="small" variant="outlined" />
                  ))}
                  {content.tags.length > 3 && (
                    <Chip label={`+${content.tags.length - 3}`} size="small" variant="outlined" />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* テスト結果が空の場合 */}
      {filteredContents.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            {searchQuery ? '検索結果が見つかりませんでした' : 'テスト結果がありません'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery ? '検索条件を変更してみてください' : '新しいテストを実行してみてください'}
          </Typography>
        </Box>
      )}

      {/* ページネーション */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* コンテキストメニュー */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Edit sx={{ mr: 1 }} />
          編集
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          削除
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ContentList;