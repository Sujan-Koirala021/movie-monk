import React from 'react';

const AnimatedButton = function(props) {
  const { children, className, variant = 'default', ...restProps } = props;

  return React.createElement(
    'button',
    {
      className: [
        'relative overflow-hidden group transition-all duration-300 pt-2 rounded-lg',
        variant === 'default' && 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/30',
        variant === 'outline' && 'border-blue-600 text-blue-600 hover:bg-blue-50',
        variant === 'ghost' && 'bg-transparent hover:bg-blue-50 text-foreground',
        className,
      ].filter(Boolean).join(' '),
      ...restProps
    },
    React.createElement(
      'span',
      { className: 'relative z-10' },
      children
    ),
    variant === 'default' &&
      React.createElement(
        'span',
        { className: 'absolute top-0 -right-full h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:right-full transition-all duration-500 ease-in-out transform skew-x-12' }
      )
  );
};

export default AnimatedButton;
