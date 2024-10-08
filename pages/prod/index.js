import { useState, useCallback } from 'react';
import scss from './index.module.scss';
import Head from 'next/head';
import DefaultLayout from '@/components/layout/default';
import Section from './list/section';
import Breadcrumb from './list/breadcrumb';
import Select from './list/select';
import MobileFilter from './list/mobileFilter';
import ProductPage from './list/productPage';
import Search from './list/search';

export default function ProductList() {
  const [sortBy, setSortBy] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    age: ''
  });

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  }, []);

  const handleSortChange = useCallback((newSortBy) => {
    setSortBy(newSortBy);
  }, []);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  return (
    <>
      <Head>
        <title>寵物商城</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MobileFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />
      <main className='container pt-3'>
        <div className='d-none d-md-flex'>
          <Section />
        </div>
        <div className={['hstack jc-between', scss.margin].join(' ')}>
          <Breadcrumb />
          <div className='d-none d-md-flex'>
            <Search onSearch={handleSearch} />
          </div>
          <Select onChange={handleSortChange} />
        </div>
        <div className={scss.my}>
          <ProductPage
            sortBy={sortBy}
            searchTerm={searchTerm}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </main>
    </>
  );
}

ProductList.layout = DefaultLayout;