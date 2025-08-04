// データ一覧ページコンポーネント（Firestore連携）
import React, { useState } from 'react'
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Fab,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  CardActions,
} from '@mui/material'
import { ArrowBack, Add, Edit, Delete } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { LoadingSpinner, ErrorMessage } from '../components/common'
import { DataItemModal } from '../components/data'
import { useDataItems } from '../hooks/useDataItems'
import type { DataItem, CreateDataItem } from '../types/data'

// Vue.js経験者向け解説:
// - useDataItemsフック: VueのcomposablesでAPIとの連携とReactiveデータ管理
// - Firestoreリアルタイム同期: VueのwebSocket接続のような機能
// - CRUD操作: Vueでの一般的なAPIクライアント操作パターン

const DataPage: React.FC = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { items, loading, error, createItem, updateItem, deleteItem, clearError } = useDataItems()
  
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DataItem | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<DataItem | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // カテゴリ表示の変換
  const getCategoryLabel = (category: string) => {
    const labels = {
      work: '仕事',
      personal: '個人',
      study: '勉強',
      other: 'その他',
    }
    return labels[category as keyof typeof labels] || category
  }

  // 優先度表示の変換
  const getPriorityLabel = (priority: string) => {
    const labels = {
      high: '高',
      medium: '中',
      low: '低',
    }
    return labels[priority as keyof typeof labels] || priority
  }

  // 優先度に応じた色
  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'error' as const,
      medium: 'warning' as const,
      low: 'info' as const,
    }
    return colors[priority as keyof typeof colors] || 'default' as const
  }

  // 新規作成
  const handleAdd = () => {
    setEditingItem(null)
    setModalOpen(true)
  }

  // 編集
  const handleEdit = (item: DataItem) => {
    setEditingItem(item)
    setModalOpen(true)
  }

  // 削除確認ダイアログを開く
  const handleDeleteClick = (item: DataItem) => {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  // 削除実行
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return

    setActionLoading(true)
    try {
      await deleteItem(itemToDelete.id)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    } catch (error) {
    // エラーハンドリング
  } finally {
      setActionLoading(false)
    }
  }

  // モーダル保存処理
  const handleSave = async (data: CreateDataItem) => {
    setActionLoading(true)
    try {
      if (editingItem) {
        await updateItem(editingItem.id, data)
      } else {
        await createItem(data)
      }
      setModalOpen(false)
      setEditingItem(null)
    } catch (error) {

      throw error
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              データ一覧
            </Typography>
          </Toolbar>
        </AppBar>
        <LoadingSpinner message="データを読み込んでいます..." />
      </>
    )
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            データ一覧
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
        {error && (
          <ErrorMessage 
            message={error} 
            onClose={clearError}
          />
        )}

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">
                データ管理 ({items.length}件)
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAdd}
              >
                新規追加
              </Button>
            </Box>

{isMobile ? (
              // モバイル用カード表示
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {items.map((item) => (
                  <Card key={item.id} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                          {item.title}
                        </Typography>
                        <Chip 
                          label={getPriorityLabel(item.priority)} 
                          size="small"
                          color={getPriorityColor(item.priority)}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {item.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip 
                          label={getCategoryLabel(item.category)} 
                          size="small" 
                          variant="outlined"
                        />
                        <Chip 
                          label={item.completed ? '完了' : '進行中'} 
                          size="small"
                          color={item.completed ? 'success' : 'default'}
                        />
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary">
                        更新日: {item.updatedAt.toLocaleDateString('ja-JP')}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(item)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(item)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            ) : (
              // デスクトップ用テーブル表示
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>タイトル</TableCell>
                      <TableCell>カテゴリ</TableCell>
                      <TableCell>優先度</TableCell>
                      <TableCell>状態</TableCell>
                      <TableCell>更新日時</TableCell>
                      <TableCell align="center">操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {item.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getCategoryLabel(item.category)} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getPriorityLabel(item.priority)} 
                            size="small"
                            color={getPriorityColor(item.priority)}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={item.completed ? '完了' : '進行中'} 
                            size="small"
                            color={item.completed ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          {item.updatedAt.toLocaleDateString('ja-JP')}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(item)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {items.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  データがありません
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<Add />}
                  onClick={handleAdd}
                >
                  最初のデータを追加
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>

      <Fab
        color="primary"
        sx={{ 
          position: 'fixed', 
          bottom: { xs: 16, md: 32 }, 
          right: { xs: 16, md: 32 },
          size: { xs: 'medium', md: 'large' }
        }}
        onClick={handleAdd}
      >
        <Add />
      </Fab>

      {/* データ作成・編集モーダル */}
      <DataItemModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingItem(null)
        }}
        onSave={handleSave}
        editItem={editingItem}
        loading={actionLoading}
      />

      {/* 削除確認ダイアログ */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>データ削除の確認</DialogTitle>
        <DialogContent>
          <Typography>
            「{itemToDelete?.title}」を削除してもよろしいですか？
            この操作は取り消せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={actionLoading}>
            キャンセル
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? '削除中...' : '削除'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DataPage