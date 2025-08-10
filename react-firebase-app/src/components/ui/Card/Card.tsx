import React from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import styles from './Card.module.css';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  as?: 'div' | 'article' | 'section';
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className,
  onClick,
  hover = false,
  as: Component = 'div',
}) => {
  const cardClasses = classNames(
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    {
      [styles.clickable]: onClick,
      [styles.hover]: hover,
    },
    className
  );

  const MotionComponent = motion[Component as keyof typeof motion] as any;

  return (
    <MotionComponent
      className={cardClasses}
      onClick={onClick}
      whileHover={
        (onClick || hover) && !onClick
          ? { y: -2, boxShadow: 'var(--shadow-bubble)' }
          : onClick
          ? { scale: 1.02 }
          : {}
      }
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </MotionComponent>
  );
};

export default Card;