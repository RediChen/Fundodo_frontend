import React from 'react';
import NavHeader from '@/components/layout/navHeader';
import styles from '@/pages/hotel/index.module.scss';
import SearchBar from '@/pages/hotel/SearchBar';
import Head from 'next/head';

export default function HotelPage() {
  return (
    <>
      <Head>
        <title>寵物旅館住宿</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.pageContainer}>
        <NavHeader />
      
        <main className={styles.mainContent}>
          <SearchBar />
        </main>
      </div>
    </>
  );
}
