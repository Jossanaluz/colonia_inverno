import * as React from 'react';
import styles from '../styles/TabSelector.module.css';

export const TabSelector = ({
  isActive,
  children,
  onClick,
  style
}: {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
  style:any
}) => (
  <button
    style={style}
    className={`${styles.tab_container} ${isActive && styles.tab_container_active}`}
    onClick={onClick}
  >
    {children}
  </button>
);
