"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from 'next/image';
import { useEffect } from "react";
import { config } from '../../../config';
import { NavItem } from '@/lib/types';
import Link from 'next/link';
import MobileNav from './mobile-nav';
import { cn } from '@/lib/utils';

export const defaultNavigation = {
  items: config.navigation?.items ?? [
    { label: "About", href: "#about", enabled: true },
    { label: "Servers", href: "#servers", enabled: true },
    { label: "Leaderboard", href: "#leaderboard", enabled: config.cftools.leaderboard.enabled },
    { label: "Contact", href: "#contact", enabled: true },
  ],
} satisfies { items: NavItem[] };

function useBoundedScroll(threshold: number) {
  let { scrollY } = useScroll();
  let scrollYBounded = useMotionValue(0);
  let scrollYBoundedProgress = useTransform(
    scrollYBounded,
    [0, threshold],
    [0, 1]
  );

  useEffect(() => {
    return scrollY.on("change", (current) => {
      let previous = scrollY.getPrevious();
      let diff = typeof previous === 'number'
        ? current - previous
        : current;
      let newScrollYBounded = scrollYBounded.get() + diff;

      scrollYBounded.set(clamp(newScrollYBounded, 0, threshold));
    });
  }, [threshold, scrollY, scrollYBounded]);

  return { scrollYBounded, scrollYBoundedProgress };
}

export type HeaderProps = {
  items?: NavItem[];
  className?: string;
  useGutter?: boolean;
};

export default function Header({
  className,
  items = defaultNavigation.items,
  useGutter = false,
}: HeaderProps) {
  items = items.filter((item) => item.enabled);
  
  // Note: 80px is exactly h-20 in Tailwind CSS
  // This is the threshold where the header will shrink
  let { scrollYBoundedProgress } = useBoundedScroll(80);
  let scrollYBoundedProgressDelayed = useTransform(
    scrollYBoundedProgress,
    [0, 0.75, 1],
    [0, 0, 1]
  );

  return (
    <div className={cn("z-50 flex-1 overflow-y-scroll", className)}>
      <motion.header
        style={{
          height: useTransform(
            scrollYBoundedProgressDelayed,
            [0, 1],
            [80, 50]
          ),
          backgroundColor: useMotionTemplate`rgb(2 6 23 / ${useTransform(
            scrollYBoundedProgressDelayed,
            [0, 1],
            [1, 0.1]
          )})`,
          borderBottomColor: config.themeColor,
          borderBottomWidth: useTransform(
            scrollYBoundedProgressDelayed,
            [0, 1],
            [3, 1]
          ),
        }}
        className={`fixed inset-x-0 flex h-20 shadow backdrop-blur-md duration-300`}
      >
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-8">
          <motion.div
            style={{
              scale: useTransform(
                scrollYBoundedProgressDelayed,
                [0, 1],
                [1, 0.9]
              ),
            }}
            className="flex origin-left items-center text-xl font-semibold uppercase duration-300"
          >
            <Link href="/" onDragStart={(e) => e.preventDefault()}>
              <Image
                src={config.logoURL}
                alt="Logo"
                width={80}
                height={80}
                priority
                onDragStart={(e) => e.preventDefault()}
              />
            </Link>
          </motion.div>
          <motion.nav
            style={{
              opacity: useTransform(
                scrollYBoundedProgressDelayed,
                [0, 1],
                [1, 0]
              ),
            }}
            className="hidden sm:flex space-x-4 text-sm font-medium text-slate-400 duration-300"
          >
            {items.map((item, index) => (
              <Link key={index} href={item.href} className='font-bold hover:text-primary duration-300'>
                {item.label}
              </Link>
            ))}
          </motion.nav>
          <motion.div className='block sm:hidden duration-300'
            style={{
              scale: useTransform(
                scrollYBoundedProgressDelayed,
                [0, 1],
                [1, 0.9]
              ),
            }}
          >
            <MobileNav items={items} className="bg-none border-none" />
          </motion.div>
        </div>
      </motion.header>
      {/* Gutter */}
      {useGutter && <div className="h-20 w-full" />}
    </div>
  );
}

let clamp = (number: number, min: number, max: number) =>
  Math.min(Math.max(number, min), max);
