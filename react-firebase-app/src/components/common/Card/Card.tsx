import React from 'react'
import { 
  Card as MuiCard, 
  CardContent, 
  CardActions, 
  CardHeader,
  Avatar,
  IconButton,
  Typography,
  Box,
  Chip
} from '@/utils/mui-fallbacks'
import { MoreVert, Favorite, Share } from '@/utils/mui-fallbacks'

export interface CardProps {
  /** カードのタイトル */
  title: string
  /** サブタイトル */
  subtitle?: string
  /** メインコンテンツ */
  content: string
  /** カードの画像URL */
  imageUrl?: string
  /** アバター画像URL */
  avatarUrl?: string
  /** タグリスト */
  tags?: string[]
  /** いいね数 */
  likeCount?: number
  /** シェア数 */
  shareCount?: number
  /** カードの変種 */
  variant?: 'outlined' | 'elevation'
  /** 最大幅 */
  maxWidth?: number
  /** クリック時のコールバック */
  onClick?: () => void
  /** いいねボタンクリック時のコールバック */
  onLike?: () => void
  /** シェアボタンクリック時のコールバック */
  onShare?: () => void
  /** メニューボタンクリック時のコールバック */
  onMenuClick?: () => void
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  content,
  imageUrl,
  avatarUrl,
  tags = [],
  likeCount = 0,
  shareCount = 0,
  variant = 'elevation',
  maxWidth = 400,
  onClick,
  onLike,
  onShare,
  onMenuClick,
}) => {
  return (
    <MuiCard
      variant={variant}
      sx={{ 
        maxWidth,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        } : {}
      }}
      onClick={onClick}
    >
      <CardHeader
        avatar={
          avatarUrl ? (
            <Avatar src={avatarUrl} aria-label="avatar" />
          ) : (
            <Avatar aria-label="avatar">
              {title.charAt(0).toUpperCase()}
            </Avatar>
          )
        }
        action={
          onMenuClick && (
            <IconButton aria-label="settings" onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              onMenuClick()
            }}>
              <MoreVert />
            </IconButton>
          )
        }
        title={title}
        subheader={subtitle}
      />
      
      {imageUrl && (
        <Box
          component="img"
          sx={{
            height: 200,
            width: '100%',
            objectFit: 'cover',
          }}
          src={imageUrl}
          alt={title}
        />
      )}
      
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
        
        {tags.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {tags.map((tag, index) => (
              <Chip 
                key={index} 
                label={tag} 
                size="small" 
                variant="outlined" 
              />
            ))}
          </Box>
        )}
      </CardContent>
      
      {(onLike || onShare) && (
        <CardActions disableSpacing>
          {onLike && (
            <IconButton 
              aria-label="add to favorites"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                onLike()
              }}
            >
              <Favorite />
              {likeCount > 0 && (
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  {likeCount}
                </Typography>
              )}
            </IconButton>
          )}
          
          {onShare && (
            <IconButton 
              aria-label="share"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                onShare()
              }}
            >
              <Share />
              {shareCount > 0 && (
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  {shareCount}
                </Typography>
              )}
            </IconButton>
          )}
        </CardActions>
      )}
    </MuiCard>
  )
}

export default Card