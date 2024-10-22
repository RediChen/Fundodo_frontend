import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import scss from './prodSec.module.scss';
import FddBtn from '@/components/buttons/fddBtn';
import feed1 from '@/public/pic-prod/PR0000000052.jpg';
import feed2 from '@/public/pic-prod/PR0000000233.jpg';
import feed3 from '@/public/pic-prod/PR0000002921.jpg';
import feed4 from '@/public/pic-prod/PR0000002962.jpg';
import PdBg from '@/public/homePic/pd_bg.png';
import { FaArrowRight } from "react-icons/fa";

export default function ProdSec() {
  const prodTextRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } // 當10%的元素可見時觸發
    );

    if (prodTextRef.current) {
      observer.observe(prodTextRef.current);
    }

    return () => {
      if (prodTextRef.current) {
        observer.unobserve(prodTextRef.current);
      }
    };
  }, []);

  return (
    <section className={scss.bgWrapper}>
      <div className={scss.bg} style={{ '--bg-image': `url(${PdBg.src})` }}>
        <div className="container">
          <div className={scss.prodSec}>
            <div className={scss.prodImgs}>
              {[feed1, feed2, feed3, feed4].map((feed, index) => (
                <div key={index} className={['img-wrap-w100', scss.imgBox].join(' ')}>
                  <Image src={feed} alt="" width={276} height={251} />
                </div>
              ))}
            </div>
            <div
              ref={prodTextRef}
              className={`${scss.prodText} ${isVisible ? scss.animate : ''}`}
            >
              <h3>狗狗的全部需求，一站式解決</h3>
              <FddBtn color='primary' href='/prod' className={scss.proBtn}>
                立即逛逛 <FaArrowRight />
              </FddBtn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}