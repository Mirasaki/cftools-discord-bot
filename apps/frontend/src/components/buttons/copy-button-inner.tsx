'use client';

import React from 'react';
import { copyTextToClipboard } from '@/lib/dom-copy';
import {
  CopyIcon,
  CheckIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';


export type CopyButtonProps = {
  text: string;
  className?: string;
};

const CopyButtonInner = ({
  text,
  className,
}: CopyButtonProps) => {
  return (
    <CopyIcon className={cn(
      'duration-300 h-5 w-5 hover:scale-110 hover:text-primary hover:cursor-pointer',
      className,
    )} onClick={() => copyTextToClipboard(text)}
    />
  );
};

export const CopyButton = ({
  text,
  className,
  children,
}: CopyButtonProps & {
  children?: React.ReactNode;
}) => {
  const [ disabled, setDisabled ] = React.useState(false);
  return (<Button
    variant='default'
    disabled={disabled}
    className={cn('group', className)}
    onClick={(e) => {
      e.preventDefault();
      copyTextToClipboard(text);

      // Make button green for a moment
      const element = e.currentTarget as HTMLButtonElement;
      element.classList.remove('bg-primary');
      element.classList.add('bg-green-400', 'text-white');

      // Replace icon with checkmark
      const icon = element.querySelector('svg');
      if (icon) {
        icon.classList.add('hidden');
      }
      const checkmark = element.querySelector('.checkmark');
      if (checkmark) {
        checkmark.classList.remove('hidden');
      }

      // Disable, prevents conflicting hover states
      setDisabled(true);

      // Reset button after 1 second
      setTimeout(() => {
        element.classList.add('bg-primary');
        element.classList.remove('bg-green-400', 'text-white');
        const icon = element.querySelector('svg');
        if (icon) {
          icon.classList.remove('hidden');
        }
        const checkmark = element.querySelector('.checkmark');
        if (checkmark) {
          checkmark.classList.add('hidden');
        }
        setDisabled(false);
      }, 1000);
    }}
  >
    <CopyIcon className='h-5 w-5 pr-1' />
    <CheckIcon className='h-5 w-5 pr-1 hidden checkmark' />
    {children}
  </Button>);
};

export default CopyButtonInner;
