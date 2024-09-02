import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import scss from './hotelSec.module.scss';
import FddBtn from '@/components/buttons/fddBtn';
import { IconContext } from 'react-icons';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { IoAddCircle } from 'react-icons/io5';
import review from "@/public/homePic/review.png";
import HtBg from '@/public/homePic/ht_bg.svg'

const reviews = [
  {
    id: 1,
    title: '無與倫比的服務',
    content: '我的狗狗在這裡得到了最好的照顧。旅館環境乾淨、安全，工作人員非常有愛心和專業，每天都會定時帶狗狗活動，讓我完全放心。非常推薦！',
    author: '汪主人',
    date: '2024/06/17',
    image: '/hotelPic/pic/HT0000163.jpg'
  },
  {
    id: 2,
    title: '超越期待的體驗',
    content: '第一次把愛犬寄放在這裡，原本很擔心，但這裡的照顧真的超乎我的想像！環境舒適，員工親切，還會定期發送照片和影片，讓我隨時了解狗狗的狀況。',
    author: '小花爸爸',
    date: '2024/07/05',
    image: '/hotelPic/pic/HT0000162.jpg'
  },
  {
    id: 3,
    title: '專業細心的團隊',
    content: '我家的老狗需要特別照顧，這裡的團隊非常細心地照顧他的需求。每次接他回家，他都很開心、狀態很好。感謝你們的用心！',
    author: '柴犬人',
    date: '2024/08/20',
    image: '/hotelPic/pic/vip.jpg'
  },
  {
    id: 4,
    title: '寵物的天堂',
    content: '這裡簡直就是寵物的度假天堂！妮妮每次來都玩得很開心。工作人員會耐心地陪伴和照顧，還會提供豐富的玩具和活動。強烈推薦給所有寵物主人！',
    author: '妮妮媽',
    date: '2024/09/10',
    image: '/hotelPic/pic/nini.jpg'
  }
];


export default function HotelSec() {
  const [currentReview, setCurrentReview] = useState(0);
  const [direction, setDirection] = useState('right');
  const [key, setKey] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setDirection('left');
    setCurrentReview((prevReview) => (prevReview - 1 + reviews.length) % reviews.length);
    setKey(prevKey => prevKey + 1);
  };

  const handleNext = () => {
    setDirection('right');
    setCurrentReview((prevReview) => (prevReview + 1) % reviews.length);
    setKey(prevKey => prevKey + 1);
  };


  return (
    <>
      <div className={scss.hotel} style={{ '--bg-image': `url(${HtBg.src})` }}>
        <div className="container">
          <div className={scss.hotelSec}>
            <div className={scss.hotelContent}>
              <div className={scss.hotelText}>
                <h2>安心寵物住宿!</h2>
                <p>我們提供舒適、安全的住宿環境，全天候專業照顧，並安排每日活動，確保您的愛犬在這裡享受快樂、<br /> 放鬆的度假時光。</p>
              </div>

              <div className={scss.btns}>
                <button className={scss.backBtn} onClick={handlePrev}>
                  <IconContext.Provider value={{ size: '2.5rem' }}>
                    <IoIosArrowBack className={scss.ArrowBack} />
                  </IconContext.Provider>
                </button>
                <button className={scss.fowBtn} onClick={handleNext}>
                  <IconContext.Provider value={{ size: '2.5rem' }}>
                    <IoIosArrowForward className={scss.ArrowFow} />
                  </IconContext.Provider>
                </button>
              </div>
            </div>
            <div className={scss.hotelReviewWrapper}>
              <div className={`${scss.hotelReview} ${scss[direction]}`}>
                <div className={scss.images}>
                  <Image
                    className={scss.images}
                    src={reviews[currentReview].image}
                    alt={`Review by ${reviews[currentReview].author}`}
                    // layout="responsive"
                    width={580}
                    height={380}
                  />
                </div>
                <div className={scss.content}>
                  <div className={scss.text}>
                    <h4>{reviews[currentReview].title}</h4>
                    <p>{reviews[currentReview].content}</p>
                  </div>
                  <div className={scss.info}>
                    <h6>{reviews[currentReview].author}</h6>
                    <p>{reviews[currentReview].date}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
