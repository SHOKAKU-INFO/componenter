import React from 'react';
import styles from '../../styles/atoms/Button.module.css';

type Props = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    disabled?: boolean;
    style?: React.CSSProperties;
};

export default function Button({
   children,
   onClick,
   type = 'button',
   className = '',
   disabled = false,
   style,
}: Props) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${styles.button} ${disabled ? styles.disabled : ''} ${className}`}
            style={style} // ← ここで外部から渡された色やフォントサイズを反映
        >
            {children}
        </button>
    );
}
