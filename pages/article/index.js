//== Parameters ================================================================
import { breakpoints } from '@/configs';
//== Functions =================================================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useScreenWidth from '@/hooks/useScreenWidth';
//== Components ================================================================
import Head from 'next/head';
import DefaultLayout from '@/components/layout/default';
import TitleAction from './commonItem/titleAction';
import UserAction from './commonItem/userAction';
import ArtiAside from './commonItem/aside';
import ArticleList from './list/articleList';
import PageControl from './list/pageControl';
import AsideRwd from './commonItem/asideRwd';
//== Styles =================================================================
import scss from '@/pages/article/index.module.scss';

export default function Index() {
  //for RWD
  const screenWidth = useScreenWidth();
  const [w__screen, setW__screen] = useState(1920);

  useEffect(() => {
    setW__screen(screenWidth);
  }, [screenWidth]);

  //for sorting
  const router = useRouter();
  const [currentOrderBy, setCurrentOrderBy] = useState('1');

  const handleOrderByChange = (newOrderBy) => {
    setCurrentOrderBy(newOrderBy);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, orderBy: newOrderBy },
    }, undefined, { shallow: true });
  };

  useEffect(() => {
    if (router.query.orderBy) {
      setCurrentOrderBy(router.query.orderBy);
    }
  }, [router.query.orderBy]);
  return (
    <>
      <Head>
        <title>文章列表</title>
      </Head>
      <div className='bg-tint5'>
        <div className="container-lg" style={{ paddingTop: '40px' }}>
          <UserAction
            onOrderByChange={handleOrderByChange}
            currentOrderBy={currentOrderBy}
          />
          <TitleAction />
          <div className='row mt-3 mt-lg-4'>
            {w__screen >= breakpoints.md && (
              <div className="col-4 col-xl-3">
                <ArtiAside />
              </div>
            )}
            <main className='col-12 col-md-8 col-xl-7'>
              <ArticleList orderBy={currentOrderBy} />
            </main>
            {w__screen >= breakpoints.xl && (
              <div className="col-2">
                <PageControl />
              </div>
            )}
          </div>
          {w__screen < breakpoints.md && (
            <div className="container-fluid">
              <AsideRwd />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

Index.layout = DefaultLayout;
