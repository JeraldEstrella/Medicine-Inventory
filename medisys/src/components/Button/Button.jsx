import './Button.css';

/**
 * variant: 'primary' | 'secondary' | 'danger' | 'green'
 * size:    'sm' | 'md' (default)
 */
export default function Button({ children, variant = 'secondary', size = 'md', className = '', ...props }) {
  return (
    <button
      className={`btn btn-${variant}${size === 'sm' ? ' btn-sm' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
