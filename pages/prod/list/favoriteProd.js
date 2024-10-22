import React, { useState, useEffect, useContext } from 'react';
import DefaultLayout from '@/components/layout/default';
import scss from './favoriteProd.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import SideText from '@/components/member/SideText';
import SideText2 from '@/components/member/SideText_2'
import { AuthContext } from '@/context/AuthContext';
import doggy from '/public/prodPic/44f50e13786c6d6f2a1be1fff7eab1c2.png';

export default function FavoriteProd() {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [error, setError] = useState(null);
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (loading) return;

      if (!user) {
        setError('請先登入');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        console.log('Using token:', token); // 檢查 token

        const response = await fetch(`http://localhost:3005/api/prod/favorites`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Response status:', response.status);

        if (response.status === 401) {
          setError('未授權，請重新登入');
          // 可能需要在這裡調用 logout 函數
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data:', data);
        setFavoriteProducts(data.favorites);
      } catch (err) {
        console.error('Error fetching favorite products:', err);
        setError(err.message || 'Failed to load favorite products');
      }
    };

    fetchFavoriteProducts();
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <body className={'bg-secondary'}>
        <div className="col-12 d-lg-none">
          <SideText2 layoutType={0} />
        </div>
        <main className={['container row', scss.pd].join(' ')}>
          <div className={[scss.bg, 'col-lg-9 row'].join(' ')}>
            {favoriteProducts.length === 0 ? (
              <>
                <div className={[scss.pet, 'd-flex jc-center mb-3'].join(' ')}>我什麼都不喜歡</div>
                <Image src={doggy} width={500} />
              </>
            ) : (
              favoriteProducts.map((product) => (
                <div key={product.id} className='col-xxl-3 col-xl-4 col-6'>
                  <div className={scss.card}>
                    <div className={scss.prodImgBox}>
                      <div className={[scss.prodImg, 'img-wrap-w100', 'img-wrap-h100'].join(' ')}>
                        <Image
                          src={`/pic-prod/${product.product_image}`}
                          alt={product.product_name}
                          width={100}
                          height={100}

                        />
                      </div>
                    </div>
                    <div className={scss.textarea2}>
                      <div className={scss.textarea}>
                        <span className={scss.prodName}>{product.product_name}</span>
                      </div>
                      <div className={scss.textarea}>
                        <span className={scss.prodPrice}>
                          {product.product_price}
                        </span>
                      </div>
                    </div>
                    <Link className={scss.btn} href={`/prod/detail/${product.product_id}`}>
                      <span>我要購買</span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className='col-lg-3 d-none d-lg-block'>
            <SideText activeIndex={4} />
          </div>
        </main>
      </body>
    </>
  );
}

FavoriteProd.layout = DefaultLayout;