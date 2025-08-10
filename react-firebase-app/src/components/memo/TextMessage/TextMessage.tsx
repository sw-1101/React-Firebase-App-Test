import React from 'react';
import { MessageBubble } from '../MessageBubble';

export interface TextMessageProps {
  content: string;
  timestamp: Date;
  type: 'own' | 'system';
  showTime?: boolean;
  className?: string;
}

const TextMessage: React.FC<TextMessageProps> = ({
  content,
  timestamp,
  type,
  showTime = true,
  className,
}) => {
  // URLを自動的にリンクに変換する関数
  const formatContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80 transition-opacity"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <MessageBubble
      type={type}
      timestamp={timestamp}
      showTime={showTime}
      className={className}
    >
      <p className="m-0">
        {formatContent(content)}
      </p>
    </MessageBubble>
  );
};

export default TextMessage;