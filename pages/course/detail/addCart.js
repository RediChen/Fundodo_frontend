import React from 'react'
import scss from './addCart.module.scss';
import { RiCoupon3Line } from "react-icons/ri";

export default function AddCart() {
  return (
   <>
    <div className={scss.cartBox}>
    <div className={scss.price}>
      <h2>NT$ 3,600 </h2>
    </div>
    <div className={scss.coupon}>
    <RiCoupon3Line />
      <p>專屬優惠券 NT$ 50</p>
    </div>
    <div className={scss.btns}>
      <button>
        立即購買
      </button>
      <button>
        加入購物車
      </button>
    </div>

    </div>
   </>
  )
}