import '@/styles/reset.css';
import '@/styles/global.scss';
//todo: test ↓↓↓↓↓
import '@/styles/utilities/_utilities_api.scss';
//todo: test ↑↑↑↑↑
//字型僅於此匯入一次，即可全域使用
import '@fontsource/zen-maru-gothic'; //only 400
// import '@fontsource/zen-maru-gothic/300.css';
// import '@fontsource/zen-maru-gothic/400.css';
// import '@fontsource/zen-maru-gothic/500.css';
// import '@fontsource/zen-maru-gothic/700.css';
// import '@fontsource/zen-maru-gothic/900.css';
import '@fontsource-variable/noto-sans-tc';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  // 使用自訂在頁面層級的版面(layout)
  // const getLayout = Component.getLayout || ((page) => page);
  const Layout = Component.layout;
  if (Layout) {
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
      </>
    );
  }
}

// return getLayout(<Component {...pageProps} />);
// return (
//   <>
//     <Head>
//       <meta name="viewport" content="width=device-width, initial-scale=1" />
//     </Head>
//     {getLayout(<Component {...pageProps} />)}
//   </>
// );
