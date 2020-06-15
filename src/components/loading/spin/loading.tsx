import React, { FC } from 'react';
import styles from './loading.module.scss';

interface Props {
  width?: number;
  height?: number;
}
export const LoadingIcon: FC<Props> = (props): JSX.Element => {
  const { width = 200, height = 200 } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 1024 1024" version="1.1" className={styles.icon}>
      <path d="M204.8 204.8m-204.8 0a204.8 204.8 0 1 0 409.6 0 204.8 204.8 0 1 0-409.6 0Z" fill="#EBF2FC"/>
      <path d="M819.2 204.8m-204.8 0a204.8 204.8 0 1 0 409.6 0 204.8 204.8 0 1 0-409.6 0Z" fill="#B5D2F3"/>
      <path d="M819.2 819.2m-204.8 0a204.8 204.8 0 1 0 409.6 0 204.8 204.8 0 1 0-409.6 0Z" fill="#7FB0EA"/>
      <path d="M204.8 819.2m-204.8 0a204.8 204.8 0 1 0 409.6 0 204.8 204.8 0 1 0-409.6 0Z" fill="#4A90E2"/>
    </svg>
  );
};
