import React from 'react';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HeaderProps, defaultNavigation } from './animated-header';
import { MenuIcon, XIcon } from 'lucide-react';
import LinkButton from '../buttons/link-button';
import Image from 'next/image';
import { config } from '../../../config';

const MobileNav = ({
  items = defaultNavigation.items,
  className,
}: HeaderProps) => {
  items = items.filter((item) => item.enabled);
  return (
    <Drawer direction='top' >
      <div>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className={cn(className)}>
            <MenuIcon className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
      </div>

      <DrawerContent hideBar className={cn(
        'bg-background dark:bg-slate-950',
      )}>
        <ScrollArea className='h-screen'>
          <div className='container'>
            <div className="px-2 mx-auto">
              {/* <MainNavBranding className='flex items-center justify-center' /> */}
              <DrawerClose asChild className={cn(
                'absolute top-2 right-2 cursor-pointer duration-300',
              )}>
                <XIcon className="h-7 w-7 hover:text-primary hover:scale-125" />
              </DrawerClose>
            </div>
            <div className='flex flex-col gap-4 justify-center items-center py-4'>
              <Image
                src={config.logoURL}
                alt="Logo"
                width={100}
                height={100}
                onDragStart={(e) => e.preventDefault()}
                loading='lazy'
              />
            </div>
            <div className={cn(
              'flex flex-col gap-4 flex-grow h-max',
              'p-4 border-t border-muted',
            )}>
                {items.map((item, index) => (
                  <LinkButton key={index} href={item.href}
                    variant="ghost"
                    size="lg"
                    className='w-fit mx-auto'
                  >
                    {item.label}
                  </LinkButton>
                ))}
            </div>
          </div>
          <DrawerFooter className='container max-w-sm border-t border-muted'>
            <div className="text-center">
              Created with ❤️ by Mirasaki Development
            </div>
          </DrawerFooter>
        </ScrollArea>
      </DrawerContent>
    </Drawer>);
};

export default MobileNav;
