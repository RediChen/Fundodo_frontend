import { useRef, useCallback } from 'react'
import scss from './productGrid.module.scss'
import Image from 'next/image'
import FavoriteIcon from './favoriteIcon'
import Link from 'next/link'
import doggy from '/public/prodPic/44f50e13786c6d6f2a1be1fff7eab1c2.png';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function ProductGrid({ products, className, page, totalPages, onPageChange }) {

  const debounceTimerRef = useRef(null);

  // 定義一個函數來獲取價格數組中的最大值和最小值
  const getMaxMinPrice = (priceArr) => {
    const prices = priceArr.map(price => parseFloat(price)).filter(price => price > 0);
    if (prices.length === 0) return { maxPrice: 0, minPrice: 0 };
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    return { maxPrice, minPrice };
  }

  // 定義一個函數來格式化價格
  const formatPrice = (price) => {
    return new Intl.NumberFormat('zh-TW').format(Math.floor(price));
  }

  // 定義一個函數來獲取價格顯示的文字
  const getPriceDisplay = (priceArr) => {
    const { maxPrice, minPrice } = getMaxMinPrice(priceArr);
    const uniquePrices = [...new Set(priceArr.filter(price => parseFloat(price) > 0))];

    if (uniquePrices.length === 0) {
      return '價格未提供';
    } else if (uniquePrices.length === 1) {
      return `NT$ ${formatPrice(uniquePrices[0])}`;
    } else {
      return `NT$ ${formatPrice(minPrice)} - NT$ ${formatPrice(maxPrice)}`;
    }
  }

  const getPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 7;
    const sidePages = 2;

    items.push(1);
    if (page > sidePages + 2) {
      items.push('...');
    }

    let start = Math.max(2, page - sidePages);
    let end = Math.min(totalPages - 1, page + sidePages);

    if (end - start + 3 > maxPagesToShow) {
      if (page - start > end - page) {
        start = Math.max(2, end - maxPagesToShow + 3);
      } else {
        end = Math.min(totalPages - 1, start + maxPagesToShow - 3);
      }
    }

    for (let i = start; i <= end; i++) {
      items.push(i);
    }

    if (end < totalPages - 1) {
      items.push('...');
    }

    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  };

  const debouncedPageChange = useCallback((newPage) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      onPageChange(newPage);
    }, 300); // 300ms 延遲
  }, [onPageChange]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      debouncedPageChange(newPage);
    }
  };

  return (
    <div className={['row', 'g-3', 'w-100', className].join(' ')}>
      {totalPages > 1 && (
        <div className='d-none d-md-flex jc-center mb-3'>
          <label
            onClick={() => handlePageChange(page - 1)}
            className={`${scss.myButton} ${page === 1 ? scss.disabled : ''}`}
          >
            <input type="button" className='d-none' />
            <IoIosArrowBack size={24} />
          </label>
          {getPaginationItems().map((item, index) => (
            item === '...' ? (
              <span key={index}>...</span>
            ) : (
              <label
                key={index}
                onClick={() => handlePageChange(item)}
                className={[page === item ? scss.activePage : '', scss.myButton].join(' ')}
              >
                <input type="button" className='d-none' />
                {item}
              </label>
            )
          ))}
          <label
            onClick={() => handlePageChange(page + 1)}
            className={`${scss.myButton} ${page === totalPages ? scss.disabled : ''}`}
          >
            <input type="button" className='d-none' />
            <IoIosArrowForward size={24} />
          </label>
        </div>
      )}
      {products.length > 0 ? (
        products.map((v, i) => (
          <div key={i} className={['col-xxl-3 col-xl-4 col-6', scss.cardGrid].join(' ')}>
            <div className={scss.card}>
              <div className='d-flex jc-end'>
                <FavoriteIcon
                  style={{ color: '#B9A399' }}
                  className={scss.cardFavIcon}
                  productId={v.id}
                  productData={{
                    id: v.id,
                    name: v.name,
                    price: getPriceDisplay(v.priceArr),
                    image: v.picNameArr[0]
                  }}
                />
              </div>
              <div className={[scss.prodImgBox].join(' ')}>
                <Image objectFit="cover" src={`/pic-prod/${v.picNameArr[0]}`} width={0} height={0} />
              </div>
              <div className={scss.textarea2}>
                <div className={scss.textarea}>
                  <span className={scss.prodName}>{v.name}</span>
                </div>
                <div className={scss.textarea}>
                  <span className={scss.prodPrice}>
                    {getPriceDisplay(v.priceArr)}
                  </span>
                </div>
              </div>
              <Link className={scss.btn} type='button' href={`/prod/detail/${v.id}`}><span>我要購買</span></Link>
            </div>
          </div>
        ))
      ) : (
        <div className="d-flex flex-col ai-center">
          <div className={scss.pet}>找不到QAQ</div>
          <Image src={doggy} />
        </div>
      )}
      {totalPages > 1 && (
        <div className='d-flex jc-center mt-5'>
          <label
            onClick={() => handlePageChange(page - 1)}
            className={`${scss.myButton} ${page === 1 ? scss.disabled : ''}`}
          >
            <input type="button" className='d-none' />
            <IoIosArrowBack size={24} />
          </label>
          {getPaginationItems().map((item, index) => (
            item === '...' ? (
              <span key={index}>...</span>
            ) : (
              <label
                key={index}
                onClick={() => handlePageChange(item)}
                className={[page === item ? scss.activePage : '', scss.myButton].join(' ')}
              >
                <input type="button" className='d-none' />
                {item}
              </label>
            )
          ))}
          <label
            onClick={() => handlePageChange(page + 1)}
            className={`${scss.myButton} ${page === totalPages ? scss.disabled : ''}`}
          >
            <input type="button" className='d-none' />
            <IoIosArrowForward size={24} />
          </label>
        </div>
      )}
    </div>
  )
}