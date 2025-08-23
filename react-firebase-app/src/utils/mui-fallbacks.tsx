// 一時的なMUIフォールバック - 段階的なMUI削除のため
// 最終的にはこのファイルは削除され、各コンポーネントでCSS Modulesに移行予定

import React from 'react';

// 基本コンポーネントのプレースホルダー実装
export const Box = ({ children, sx, component = 'div', onClick, ...props }: any) => 
  React.createElement(component, { style: sx, onClick, ...props }, children);

export const Typography = ({ children, variant, color, sx, component, ...props }: any) => {
  const Tag = component || (variant === 'h1' ? 'h1' : 
                variant === 'h2' ? 'h2' : 
                variant === 'h3' ? 'h3' : 
                variant === 'h4' ? 'h4' : 
                variant === 'h5' ? 'h5' : 
                variant === 'h6' ? 'h6' : 
                variant === 'body1' ? 'p' : 
                variant === 'body2' ? 'p' : 
                variant === 'caption' ? 'span' : 'div');
  return <Tag style={{ ...sx, color }} {...props}>{children}</Tag>;
};

export const Button = ({ children, onClick, variant, color, size, disabled, startIcon, endIcon, sx, fullWidth, ...props }: any) => (
  <button 
    onClick={onClick} 
    disabled={disabled} 
    style={{ 
      ...sx,
      padding: size === 'small' ? '6px 12px' : size === 'large' ? '12px 24px' : '8px 16px',
      backgroundColor: variant === 'contained' ? '#1976d2' : 'transparent',
      color: variant === 'contained' ? 'white' : '#1976d2',
      border: variant === 'outlined' ? '1px solid #1976d2' : 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      width: fullWidth ? '100%' : 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      justifyContent: 'center'
    }} 
    {...props}
  >
    {startIcon}
    {children}
    {endIcon}
  </button>
);

export const Card = ({ children, sx, onClick, ...props }: any) => (
  <div 
    style={{ 
      ...sx, 
      border: '1px solid #e0e0e0', 
      borderRadius: '8px', 
      padding: '16px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }} 
    onClick={onClick}
    {...props}
  >
    {children}
  </div>
);

export const CardContent = ({ children, sx, ...props }: any) => (
  <div style={sx} {...props}>{children}</div>
);

export const CardActions = ({ children, sx, ...props }: any) => (
  <div style={{ ...sx, padding: '8px 0' }} {...props}>{children}</div>
);

export const IconButton = ({ children, onClick, size, disabled, sx, ...props }: any) => (
  <button 
    onClick={onClick} 
    disabled={disabled} 
    style={{ 
      ...sx,
      background: 'none', 
      border: 'none', 
      cursor: 'pointer', 
      padding: size === 'small' ? '6px' : '8px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }} 
    {...props}
  >
    {children}
  </button>
);

export const TextField = ({ value, onChange, placeholder, disabled, multiline, rows, fullWidth, size, InputProps, sx, error, helperText, label, ...props }: any) => {
  const Component = multiline ? 'textarea' : 'input';
  return (
    <div style={{ width: fullWidth ? '100%' : 'auto', marginBottom: '16px' }}>
      {label && <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#666' }}>{label}</label>}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {InputProps?.startAdornment && <div style={{ position: 'absolute', left: '8px', zIndex: 1 }}>{InputProps.startAdornment}</div>}
        <Component
          type={multiline ? undefined : 'text'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={multiline ? rows : undefined}
          style={{
            ...sx,
            padding: size === 'small' ? '8px' : '12px',
            paddingLeft: InputProps?.startAdornment ? '40px' : '12px',
            paddingRight: InputProps?.endAdornment ? '40px' : '12px',
            border: `1px solid ${error ? '#f44336' : '#ddd'}`,
            borderRadius: '4px',
            width: '100%',
            resize: multiline ? 'vertical' : 'none'
          }}
          {...props}
        />
        {InputProps?.endAdornment && <div style={{ position: 'absolute', right: '8px', zIndex: 1 }}>{InputProps.endAdornment}</div>}
      </div>
      {helperText && <div style={{ fontSize: '12px', color: error ? '#f44336' : '#666', marginTop: '4px' }}>{helperText}</div>}
    </div>
  );
};

export const InputAdornment = ({ children, position, ...props }: any) => (
  <div {...props}>{children}</div>
);

export const Container = ({ children, maxWidth, sx, ...props }: any) => (
  <div 
    style={{ 
      ...sx, 
      maxWidth: maxWidth === 'sm' ? '600px' : maxWidth === 'md' ? '900px' : maxWidth === 'lg' ? '1200px' : '100%', 
      margin: '0 auto', 
      padding: '0 16px' 
    }} 
    {...props}
  >
    {children}
  </div>
);

export const Grid = ({ children, container, item, xs, sm, md, lg, spacing, sx, ...props }: any) => (
  <div 
    style={{
      ...sx,
      display: container ? 'flex' : 'block',
      flexWrap: container ? 'wrap' : 'nowrap',
      gap: container && spacing ? `${spacing * 8}px` : '0',
      width: item ? `${(xs || 12) * 100 / 12}%` : '100%'
    }}
    {...props}
  >
    {children}
  </div>
);

export const Paper = ({ children, sx, elevation, ...props }: any) => (
  <div 
    style={{ 
      ...sx, 
      backgroundColor: 'white', 
      padding: '16px', 
      borderRadius: '8px', 
      boxShadow: `0 ${elevation || 1}px ${(elevation || 1) * 2}px rgba(0,0,0,0.1)` 
    }} 
    {...props}
  >
    {children}
  </div>
);

export const Chip = ({ label, onDelete, color, size, variant, sx, ...props }: any) => (
  <span 
    style={{ 
      ...sx, 
      display: 'inline-flex', 
      alignItems: 'center',
      gap: '4px',
      padding: size === 'small' ? '2px 6px' : '4px 8px', 
      backgroundColor: color === 'primary' ? '#e3f2fd' : color === 'secondary' ? '#fce4ec' : '#f0f0f0', 
      color: color === 'primary' ? '#1976d2' : color === 'secondary' ? '#c2185b' : '#666',
      border: variant === 'outlined' ? '1px solid currentColor' : 'none',
      borderRadius: '16px', 
      fontSize: size === 'small' ? '12px' : '14px' 
    }} 
    {...props}
  >
    {label}
    {onDelete && (
      <button 
        onClick={onDelete} 
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          marginLeft: '4px',
          padding: '0',
          fontSize: 'inherit',
          color: 'inherit'
        }}
      >
        ×
      </button>
    )}
  </span>
);

export const List = ({ children, sx, ...props }: any) => (
  <ul style={{ ...sx, listStyle: 'none', padding: 0, margin: 0 }} {...props}>{children}</ul>
);

export const ListItem = ({ children, button, onClick, sx, ...props }: any) => (
  <li 
    style={{ 
      ...sx, 
      padding: '8px 16px', 
      cursor: button ? 'pointer' : 'default',
      display: 'flex',
      alignItems: 'center'
    }} 
    onClick={onClick}
    {...props}
  >
    {children}
  </li>
);

export const ListItemText = ({ primary, secondary, sx, ...props }: any) => (
  <div style={sx} {...props}>
    <div style={{ fontWeight: 'medium' }}>{primary}</div>
    {secondary && <div style={{ fontSize: '14px', color: '#666', marginTop: '2px' }}>{secondary}</div>}
  </div>
);

export const ListItemIcon = ({ children, sx, ...props }: any) => (
  <div style={{ ...sx, marginRight: '12px', minWidth: '24px' }} {...props}>{children}</div>
);

export const Dialog = ({ open, onClose, children, fullScreen, maxWidth, fullWidth, PaperProps, ...props }: any) => 
  open ? (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 2000 
      }} 
      onClick={onClose}
      {...props}
    >
      <div 
        style={{ 
          backgroundColor: 'white', 
          borderRadius: fullScreen ? '0' : '8px', 
          minWidth: fullScreen ? '100vw' : maxWidth === 'sm' ? '400px' : maxWidth === 'md' ? '600px' : '300px',
          minHeight: fullScreen ? '100vh' : 'auto',
          maxWidth: fullWidth && !fullScreen ? '90vw' : 'auto',
          maxHeight: fullScreen ? '100vh' : '90vh',
          overflow: 'auto',
          ...PaperProps?.sx
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  ) : null;

export const DialogTitle = ({ children, sx, ...props }: any) => (
  <div style={{ ...sx, fontSize: '20px', fontWeight: 'bold', padding: '16px', borderBottom: '1px solid #e0e0e0' }} {...props}>
    {children}
  </div>
);

export const DialogContent = ({ children, sx, ...props }: any) => (
  <div style={{ ...sx, padding: '16px' }} {...props}>{children}</div>
);

export const DialogActions = ({ children, sx, ...props }: any) => (
  <div style={{ ...sx, display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '16px', borderTop: '1px solid #e0e0e0' }} {...props}>
    {children}
  </div>
);

export const Menu = ({ anchorEl, open, onClose, children, ...props }: any) => 
  open && anchorEl ? (
    <>
      <div 
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} 
        onClick={onClose}
      />
      <div 
        style={{ 
          position: 'absolute', 
          top: anchorEl.getBoundingClientRect().bottom + window.scrollY,
          left: anchorEl.getBoundingClientRect().left + window.scrollX,
          zIndex: 1000, 
          backgroundColor: 'white', 
          border: '1px solid #ddd', 
          borderRadius: '4px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          minWidth: '120px'
        }}
        {...props}
      >
        {children}
      </div>
    </>
  ) : null;

export const MenuItem = ({ children, onClick, sx, ...props }: any) => (
  <div 
    onClick={onClick} 
    style={{ 
      ...sx, 
      padding: '8px 16px', 
      cursor: 'pointer', 
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }} 
    onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#f5f5f5'}
    onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
    {...props}
  >
    {children}
  </div>
);

export const Fab = ({ children, onClick, color, sx, ...props }: any) => (
  <button 
    onClick={onClick} 
    style={{ 
      ...sx, 
      width: '56px', 
      height: '56px', 
      borderRadius: '50%', 
      border: 'none', 
      backgroundColor: color === 'primary' ? '#1976d2' : '#757575',
      color: 'white',
      cursor: 'pointer', 
      position: 'fixed', 
      bottom: '16px', 
      right: '16px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }} 
    {...props}
  >
    {children}
  </button>
);

export const CircularProgress = ({ size = 40, sx, ...props }: any) => (
  <div 
    style={{ 
      ...sx, 
      width: size, 
      height: size, 
      border: '4px solid #f0f0f0', 
      borderTop: '4px solid #1976d2', 
      borderRadius: '50%', 
      animation: 'spin 1s linear infinite' 
    }} 
    {...props} 
  />
);

export const LinearProgress = ({ value, sx, ...props }: any) => (
  <div style={{ ...sx, width: '100%', height: '4px', backgroundColor: '#f0f0f0', borderRadius: '2px', overflow: 'hidden' }} {...props}>
    <div 
      style={{ 
        width: value ? `${value}%` : '100%', 
        height: '100%', 
        backgroundColor: '#1976d2', 
        transition: 'width 0.3s',
        animation: !value ? 'indeterminate 2s infinite' : 'none'
      }} 
    />
  </div>
);

export const Snackbar = ({ open, onClose, children, autoHideDuration = 6000, ...props }: any) => {
  React.useEffect(() => {
    if (open && onClose && autoHideDuration) {
      const timer = setTimeout(onClose, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, onClose, autoHideDuration]);

  return open ? (
    <div 
      style={{ 
        position: 'fixed', 
        bottom: '16px', 
        left: '16px', 
        zIndex: 2000,
        backgroundColor: '#323232',
        color: 'white',
        padding: '6px 16px',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }} 
      {...props}
    >
      {children}
    </div>
  ) : null;
};

export const Alert = ({ children, severity, sx, action, icon, ...props }: any) => (
  <div 
    style={{ 
      ...sx, 
      padding: '12px 16px', 
      borderRadius: '4px', 
      backgroundColor: 
        severity === 'error' ? '#ffebee' : 
        severity === 'warning' ? '#fff3e0' : 
        severity === 'success' ? '#e8f5e8' : 
        severity === 'info' ? '#e3f2fd' : '#f5f5f5',
      color:
        severity === 'error' ? '#c62828' :
        severity === 'warning' ? '#ef6c00' :
        severity === 'success' ? '#2e7d32' :
        severity === 'info' ? '#1565c0' : '#333',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }} 
    {...props}
  >
    {icon}
    <div style={{ flex: 1 }}>{children}</div>
    {action}
  </div>
);

// よく使われるアイコンの実装（fontSizeプロパティ対応）
export const PlayArrow = ({ fontSize, ...props }: any) => <span {...props}>▶</span>;
export const Pause = ({ fontSize, ...props }: any) => <span {...props}>⏸</span>;
export const Stop = ({ fontSize, ...props }: any) => <span {...props}>⏹</span>;
export const Delete = ({ fontSize, ...props }: any) => <span {...props}>🗑</span>;
export const Edit = ({ fontSize, ...props }: any) => <span {...props}>✏️</span>;
export const Share = ({ fontSize, ...props }: any) => <span {...props}>📤</span>;
export const MoreVert = ({ fontSize, ...props }: any) => <span {...props}>⋮</span>;
export const Search = ({ fontSize, color, ...props }: any) => <span {...props}>🔍</span>;
export const Clear = ({ fontSize, ...props }: any) => <span {...props}>✕</span>;
export const FilterList = ({ fontSize, ...props }: any) => <span {...props}>🔽</span>;
export const Add = ({ fontSize, ...props }: any) => <span {...props}>+</span>;
export const Close = ({ fontSize, ...props }: any) => <span {...props}>✕</span>;
export const ArrowBack = ({ fontSize, ...props }: any) => <span {...props}>←</span>;
export const Refresh = ({ fontSize, ...props }: any) => <span {...props}>🔄</span>;
export const Save = ({ fontSize, ...props }: any) => <span {...props}>💾</span>;
export const Upload = ({ fontSize, ...props }: any) => <span {...props}>⬆️</span>;
export const Download = ({ fontSize, ...props }: any) => <span {...props}>⬇️</span>;
export const VolumeUp = ({ fontSize, ...props }: any) => <span {...props}>🔊</span>;
export const VolumeOff = ({ fontSize, ...props }: any) => <span {...props}>🔇</span>;
export const Mic = ({ fontSize, ...props }: any) => <span {...props}>🎤</span>;
export const MicOff = ({ fontSize, ...props }: any) => <span {...props}>🔇</span>;
export const MicNone = ({ fontSize, ...props }: any) => <span {...props}>🎤</span>;
export const TextFields = ({ fontSize, ...props }: any) => <span {...props}>📝</span>;
export const ErrorOutline = ({ fontSize, ...props }: any) => <span {...props}>⚠️</span>;
export const CheckCircle = ({ fontSize, ...props }: any) => <span {...props}>✅</span>;
export const Info = ({ fontSize, ...props }: any) => <span {...props}>ℹ️</span>;
export const Warning = ({ fontSize, ...props }: any) => <span {...props}>⚠️</span>;
export const Error = ({ fontSize, ...props }: any) => <span {...props}>❌</span>;
export const AccountCircle = ({ fontSize, ...props }: any) => <span {...props}>👤</span>;
export const Settings = ({ fontSize, ...props }: any) => <span {...props}>⚙️</span>;
export const Home = ({ fontSize, ...props }: any) => <span {...props}>🏠</span>;
export const Dashboard = () => <span>📊</span>;
export const Person = () => <span>👤</span>;
export const Storage = () => <span>💾</span>;
export const Logout = () => <span>🚪</span>;

// 追加のアイコンとコンポーネント
export const Fade = ({ children, in: fadeIn, ...props }: any) => fadeIn ? <div {...props}>{children}</div> : null;
export const GraphicEq = () => <span>📊</span>;
export type SxProps = any; // 型定義
export const CardHeader = ({ title, subheader, avatar, action, sx, ...props }: any) => (
  <div style={{ ...sx, display: 'flex', alignItems: 'center', padding: '16px' }} {...props}>
    {avatar}
    <div style={{ flex: 1, marginLeft: avatar ? '12px' : 0 }}>
      <div style={{ fontWeight: 'bold' }}>{title}</div>
      {subheader && <div style={{ fontSize: '14px', color: '#666' }}>{subheader}</div>}
    </div>
    {action}
  </div>
);
export const Avatar = ({ children, sx, src, alt, ...props }: any) => (
  <div 
    style={{ 
      ...sx, 
      width: '40px', 
      height: '40px', 
      borderRadius: '50%', 
      backgroundColor: src ? 'transparent' : '#1976d2', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      color: 'white',
      backgroundImage: src ? `url(${src})` : 'none',
      backgroundSize: 'cover'
    }} 
    {...props}
  >
    {src ? '' : children || alt?.[0]?.toUpperCase()}
  </div>
);
export const Favorite = ({ fontSize, ...props }: any) => <span {...props}>❤️</span>;
export const Pagination = ({ count, page, onChange, sx, ...props }: any) => (
  <div style={{ ...sx, display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center' }} {...props}>
    {Array.from({ length: count }, (_, i) => (
      <button 
        key={i + 1} 
        onClick={() => onChange?.(null, i + 1)} 
        style={{ 
          padding: '6px 12px', 
          border: page === i + 1 ? '2px solid #1976d2' : '1px solid #ddd', 
          backgroundColor: page === i + 1 ? '#1976d2' : 'white', 
          color: page === i + 1 ? 'white' : 'black',
          cursor: 'pointer',
          borderRadius: '4px'
        }}
      >
        {i + 1}
      </button>
    ))}
  </div>
);
export const FormControl = ({ children, sx, fullWidth, ...props }: any) => (
  <div style={{ ...sx, marginBottom: '16px', width: fullWidth ? '100%' : 'auto' }} {...props}>{children}</div>
);
export const InputLabel = ({ children, sx, ...props }: any) => (
  <label style={{ ...sx, display: 'block', marginBottom: '4px', fontSize: '14px', color: '#666' }} {...props}>{children}</label>
);
export const Select = ({ value, onChange, children, sx, fullWidth, ...props }: any) => (
  <select 
    value={value} 
    onChange={(e) => onChange?.(e)} 
    style={{ 
      ...sx, 
      padding: '8px 12px', 
      border: '1px solid #ddd', 
      borderRadius: '4px', 
      width: fullWidth ? '100%' : 'auto',
      backgroundColor: 'white'
    }} 
    {...props}
  >
    {children}
  </select>
);
export const FormControlLabel = ({ control, label, sx, ...props }: any) => (
  <div style={{ ...sx, display: 'flex', alignItems: 'center', gap: '8px' }} {...props}>
    {control}
    <span>{label}</span>
  </div>
);
export const Checkbox = ({ checked, onChange, sx, ...props }: any) => (
  <input 
    type="checkbox" 
    checked={checked} 
    onChange={(e) => onChange?.(e)} 
    style={{ ...sx, margin: 0 }} 
    {...props} 
  />
);
export const Slide = ({ children, in: slideIn, direction, ...props }: any) => slideIn ? <div {...props}>{children}</div> : null;
export const useTheme = () => ({ 
  palette: { mode: 'light' }, 
  breakpoints: { 
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
    down: (size: string) => `@media (max-width: ${size === 'sm' ? '599' : size === 'md' ? '899' : '1199'}px)`
  } 
});
export const useMediaQuery = (query: string) => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(query.replace('@media ', '')).matches;
};
export interface TransitionProps {
  in?: boolean;
  onEnter?: () => void;
  onExit?: () => void;
  timeout?: number;
}
export const EmojiEvents = () => <span>🏆</span>;
export const Send = () => <span>📤</span>;
export const AudioFile = ({ style, ...props }: any) => <span style={style} {...props}>🎵</span>;
export const VideoFile = ({ style, ...props }: any) => <span style={style} {...props}>🎬</span>;
export const VideoLibrary = () => <span>🎬</span>;
export const PictureAsPdf = ({ style, ...props }: any) => <span style={style} {...props}>📄</span>;
export const TableChart = ({ style, ...props }: any) => <span style={style} {...props}>📊</span>;
export const Image = ({ style, ...props }: any) => <span style={style} {...props}>🖼️</span>;
export const Description = () => <span>📄</span>;
export const AppBar = ({ children, sx, position, elevation, ...props }: any) => (
  <div style={{ 
    ...sx, 
    backgroundColor: '#1976d2', 
    color: 'white', 
    padding: '0',
    position: position === 'fixed' ? 'fixed' : position === 'sticky' ? 'sticky' : 'static',
    top: position === 'fixed' || position === 'sticky' ? 0 : 'auto',
    left: position === 'fixed' ? 0 : 'auto',
    right: position === 'fixed' ? 0 : 'auto',
    zIndex: position === 'fixed' || position === 'sticky' ? 1000 : 'auto',
    boxShadow: `0 2px 4px rgba(0,0,0,${Math.min((elevation || 1) * 0.1, 0.3)})`
  }} {...props}>{children}</div>
);
export const Toolbar = ({ children, sx, ...props }: any) => (
  <div style={{ 
    ...sx, 
    display: 'flex', 
    alignItems: 'center', 
    padding: '8px 16px',
    minHeight: '64px'
  }} {...props}>{children}</div>
);
export const RecordVoiceOver = () => <span>🎙️</span>;
export const Table = ({ children, sx, ...props }: any) => (
  <table style={{ ...sx, width: '100%', borderCollapse: 'collapse' }} {...props}>{children}</table>
);
export const TableBody = ({ children, sx, ...props }: any) => <tbody style={sx} {...props}>{children}</tbody>;
export const TableCell = ({ children, sx, align, ...props }: any) => (
  <td style={{ ...sx, padding: '12px', borderBottom: '1px solid #ddd', textAlign: align }} {...props}>{children}</td>
);
export const TableContainer = ({ children, sx, component, ...props }: any) => {
  const Component = component || 'div';
  return <Component style={{ ...sx, overflowX: 'auto' }} {...props}>{children}</Component>;
};
export const TableHead = ({ children, sx, ...props }: any) => (
  <thead style={{ ...sx, backgroundColor: '#f5f5f5' }} {...props}>{children}</thead>
);
export const TableRow = ({ children, sx, hover, onClick, ...props }: any) => (
  <tr 
    style={{ 
      ...sx, 
      cursor: onClick ? 'pointer' : 'default',
      ':hover': hover ? { backgroundColor: '#f5f5f5' } : {}
    }} 
    onClick={onClick}
    {...props}
  >
    {children}
  </tr>
);
export const Tab = ({ label, value, onClick, sx, ...props }: any) => (
  <button 
    onClick={() => onClick?.(null, value)} 
    style={{ 
      ...sx, 
      padding: '12px 16px', 
      border: 'none', 
      backgroundColor: 'transparent', 
      color: '#666',
      cursor: 'pointer',
      borderBottom: '2px solid transparent'
    }}
    {...props}
  >
    {label}
  </button>
);
export const Tabs = ({ value, onChange, children, sx, ...props }: any) => (
  <div style={{ ...sx, display: 'flex', borderBottom: '1px solid #ddd' }} {...props}>
    {children}
  </div>
);
export const Star = () => <span>⭐</span>;
export const Celebration = ({ style, ...props }: any) => <span style={style} {...props}>🎉</span>;
export const Grow = ({ children, in: growIn, ...props }: any) => growIn ? <div {...props}>{children}</div> : null;

// CSS用のキーフレーム定義を追加
const style = document.createElement('style');
style.textContent = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;
if (!document.head.querySelector('style[data-mui-fallbacks]')) {
  style.setAttribute('data-mui-fallbacks', 'true');
  document.head.appendChild(style);
}