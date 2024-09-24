// function
//== Parameters ================================================================
import { breakpoints } from '@/configs';
//== Functions =================================================================
import { useState, useEffect } from 'react';
import deleteCartOf from './doSoftDelete';
import useScreenWidth from '@/hooks/useScreenWidth';
//== Components ================================================================
import Image from 'next/image';
import FddBtn from '@/components/buttons/fddBtn';
//== Styles =================================================================
import s from './cart-page.module.scss';
import { TbTrashX } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";

//! CART_INDEX 不可更改
const CART_INDEX = 2;

export default function CrsCartTable({
  data = null,
  itemStateArr = [],
  setItemStateArr = () => { },
  setAmount = () => { },
}) {
  const noData = (!data || data.length === 0
    || itemStateArr[CART_INDEX].filter(v => v).length === 0);

  //for RWD
  const screenWidth = useScreenWidth();
  const [w__screen, setW__screen] = useState(1920);

  useEffect(() => {
    setW__screen(screenWidth);
  }, [screenWidth]);

  const recomputeAmount = (stateArr = itemStateArr[CART_INDEX]) => {
    const total = data.reduce((sum, cur, i) => {
      if (stateArr[i])
        return sum + cur.price;
      else
        return sum
    }, 0);
    setAmount(arr => arr.map((v, i) => (i === CART_INDEX) ? total : v));
  }

  useEffect(() => {
    if (data) recomputeAmount();
  }, [data, itemStateArr]);

  /** 刪除購物車資料 */
  const handleDelete = (i_item, db_id) => {
    // 更新前端的監控數據
    const new_arr = itemStateArr[CART_INDEX].map(
      (state, j_item) => i_item === j_item ? false : state
    );
    setItemStateArr(prev => prev.map(
      (arr, i_cart) => (i_cart === CART_INDEX) ? new_arr : arr)
    );
    // 更新 totals
    recomputeAmount(new_arr);
    // 更新後台的資料庫
    deleteCartOf(db_id);
  }

  return (
    <>
      {w__screen >= breakpoints.md ? (
        <article className='my-5'>
          <caption className='d-flex flex-row jc-between ai-center bg-tint5'>
            <span className='tx-default tx-shade4 ps-2 ps-lg-4'>共 {itemStateArr[CART_INDEX].filter(v => v).length} 堂課程</span>
            <FddBtn color='tint5' pill={false} size='sm' href='/prod'>再逛一下課程</FddBtn>
          </caption>
          <table className={s.cartTable}>
            <thead>
              <tr>
                <th><TbTrashX /></th>
                <th></th>
                <th>課程資訊</th>
                <th style={{ width: '9rem' }}>方案價</th>
                <th style={{ width: '9rem' }}>小計</th>
              </tr>
            </thead>
            <tbody className='tx-body'>
              {noData || data.map((item, i_item) => itemStateArr[CART_INDEX][i_item] && (
                <tr key={item.cart_id}>
                  <td>
                    <FddBtn color='tint4' size='sm' icon callback={() => handleDelete(i_item, item.cart_id)}>
                      <RxCross2 />
                    </FddBtn>
                  </td>
                  <td>
                    <div className="img-wrap-w100">
                      <Image
                        src={"/pic-course/" + item.pic_name}
                        width={0}
                        height={0}
                        alt={item.prod_name}
                      />
                    </div>
                  </td>
                  <td>
                    <p>{item.prod_name}</p>
                  </td>
                  <td>
                    <div className="mx-auto pe-1 tx-right w-fit">
                      ${item.price.toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <div className="mx-auto pe-1 tx-right w-fit">
                      ${item.price}
                    </div></td>
                </tr>
              ))
              }
              {noData && <tr><td colSpan={7}>
                <FddBtn color='tint1' size='sm' href='/course'>來去逛逛寵物課程</FddBtn>
              </td></tr>}
            </tbody>
          </table>
        </article>) : (<>
          <div className="container mt-5">
            <div className="row jc-between bg-shade2 p-2">
              <h3 className='col-auto tx-white tx-center'>購物車 - 課程</h3>
              <p className='col-auto tx-tint4'>
                共 {itemStateArr[CART_INDEX].filter(v => v).length} 堂課程
              </p>
            </div>
            {noData || data.map((item, i_item) => itemStateArr[CART_INDEX][i_item] && (
              <div className={["row", s.cartRowMb].join(' ')}>
                <div className="col-4 gr-center">
                  <div className="img-wrap-w100">
                    <Image
                      src={"/pic-course/" + item.pic_name}
                      width={0}
                      height={0}
                      alt={item.prod_name}
                    />
                  </div>
                </div>
                <div className={["col-8 py-3", s.cartTableMb].join(' ')}>
                  <p>{item.prod_name}</p>
                  <p>
                    ${item.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {noData &&
              <div className='row py-5'>
                <FddBtn color='tint1' size='sm' href='/prod'>來去逛逛寵物課程</FddBtn>
              </div>}
          </div>
        </>)}
    </>
  )
}
