import React from 'react'
import Head from 'next/head';
import DefaultLayout from '@/components/layout/default';
import Banner from './banner';
import Tags from './tags';
import Breadcrumb from '../prod/breadcrumb';
import CourseGrid from './courseGrid';

export default function Course() {
  return (
    <>
        <Head>
        <title>Homepage</title>
      </Head>
      <Banner/>
      <Tags/>
      <CourseGrid/>
       

     
    </>
  )
}
Course.layout = DefaultLayout;
