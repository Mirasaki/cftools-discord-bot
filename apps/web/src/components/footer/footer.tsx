import React from 'react';
import { config } from '../../../config';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className='pb-2 px-4 md:px-8 pt-4 md:pt-8 bg-white dark:bg-gray-800'>
      <div className='mx-auto max-w-screen-xl text-center'>
        <Link
          href={config.footer.brandingURL ?? '#'}
          className='flex justify-center items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-white'
        >
          <Image
            src={config.logoURL}
            alt='Logo'
            width={50}
            height={50}
          />
          {config.footer.brandingName ?? config.site.title}
        </Link>
        <ul className='my-6 flex flex-wrap justify-center items-center text-gray-900 dark:text-white'>
          {config.footer.links?.map((link, index) => (
            <li key={index}>
              <Link
                href={link.url}
                className='mr-4 hover:underline md:mr-6'
                target={link.openInNewTab ? '_blank' : undefined}
                rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <span className='text-sm text-gray-500 sm:text-center dark:text-gray-400'>
          © {
            !config.footer.initialCopyrightYear || config.footer.initialCopyrightYear === new Date().getFullYear()
              ? new Date().getFullYear()
              : `${config.footer.initialCopyrightYear}-${new Date().getFullYear()}`
          }{' '}
          <Link
            href={config.footer.copyrightBrandUrl ?? '#'}
            className='hover:underline'
          >
            {config.footer.copyrightBrandName ?? config.site.title}
          </Link>
          . All Rights Reserved.
        </span>
        <div className="text-center text-gray-500 sm:text-center dark:text-gray-400">
          Created with ❤️ by <Link
            href={'https://mirasaki.dev'}
            className='hover:underline hover:text-white'
            target='_blank'
            rel='noopener noreferrer'
          >Mirasaki Development</Link>
        </div>
        <p className='my-2 text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto'>
          {config.footer.trademarkNotice}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
