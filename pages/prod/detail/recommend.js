import React, { useState, useEffect } from 'react'
import scss from './recommend.module.scss'
import Image from 'next/image'
import FddBtn from '@/components/buttons/fddBtn'

export default function Recommend({ currentProductId, currentProductCategory }) {
  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3005/api/prod/recommended?category=${encodeURIComponent(currentProductCategory)}&excludeId=${currentProductId}&limit=8`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Received data:', data)

        if (data.status === "success" && Array.isArray(data.products)) {
          setRecommendedProducts(data.products)
        } else {
          console.error(data.message || 'Failed to fetch recommended products')
        }
      } catch (error) {
        console.error('獲取推薦產品失敗:', error)
      }
    }

    if (currentProductCategory) {
      fetchRecommendedProducts()
    }
  }, [currentProductCategory, currentProductId])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPage((prevPage) =>
        (prevPage + 1) % Math.ceil(recommendedProducts.length / 2)
      )
    }, 5000)

    return () => clearInterval(timer)
  }, [recommendedProducts.length])

  if (recommendedProducts.length === 0) {
    return <div>沒有找到推薦產品</div>
  }

  return (
    <div className={[scss.recommend].join(' ')}>
      <h3 className={scss.h3}>您可能也會喜歡</h3>
      <div className={scss.carouselContainer}>
        <div
          className={scss.carouselTrack}
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {recommendedProducts.map((product, index) => (
            <div key={product.id} className={scss.carouselItem}>
              <div className={[scss.card].join(' ')}>
                <div className={[scss.img, 'img-wrap-w100'].join(' ')}>
                  <Image
                    src={`/pic-prod/${product.image}`}
                    alt={product.name}
                    width={0}
                    height={0}

                  />
                </div>
                <div className={scss.aside}>
                  <div className='tx-default'>{product.name}</div>
                  <h3 className={scss.color}>NT${product.price.toLocaleString()}</h3>
                  <FddBtn className='text-nowrap' href={`/prod/detail/${product.id}`} as="a" size="sm">我要購買</FddBtn>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}