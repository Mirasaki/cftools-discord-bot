import React from 'react';
import { ButtonProps, buttonVariants } from '../ui/button';
import Link, { LinkProps } from 'next/link';

export type LinkButtonProps = {
  children?: React.ReactNode;
  className?: string;
  href: string;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
} & LinkProps;

const LinkButton = ({
  children,
  className,
  href,
  variant,
  size,
  ...props
}: LinkButtonProps) => {
  const isExternal = href.startsWith('http');
  return (
    <Link href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={buttonVariants({
        variant,
        className,
        size,
      })}
      {...props}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
