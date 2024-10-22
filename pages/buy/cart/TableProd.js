//== Parameters ================================================================
import { apiBaseUrl } from '@/configs';
import { breakpoints } from '@/configs';
//== Functions =================================================================
import { useEffect, useState } from 'react';
import deleteCartOf from './doSoftDelete';
import axios from 'axios';
import useScreenWidth from '@/hooks/useScreenWidth';
//== Components ================================================================
import Image from 'next/image';
import FddBtn from '@/components/buttons/fddBtn';
import { NumberPanel } from '@/components/buttons/NumberPanel';
//== Styles =================================================================
import s from './cart-page.module.scss';
import { TbTrashX } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";

//todo 將 isOutOfStock 與 stock_when_few 納入機制

//* 不可更改
const CART_INDEX = 0;

export default function ProdCartTable({
  data = null,
  itemStateArr = [],
  setItemStateArr = () => { },
  setAmount = () => { },
}) {
  const noData = (!data || data.length === 0
    || itemStateArr[CART_INDEX].filter(v => v).length === 0);

  const [qtyArr, setQtyArr] = useState([]);
  const [subtotArr, setSubtotArr] = useState([]);

  //for RWD
  const screenWidth = useScreenWidth();
  const [w__screen, setW__screen] = useState(1920);

  useEffect(() => {
    setW__screen(screenWidth);
  }, [screenWidth]);

  useEffect(() => {
    if (data) setQtyArr(data.map(d => d.quantity));
  }, [data]);

  //===== 計算 PD 購物車小計
  const updateTotal = (stateArr = itemStateArr) => {
    const subtotList = qtyArr.map((q, i) => q * data[i].price);
    const total = subtotList.reduce((total, cur, i_item) => {
      if (stateArr[CART_INDEX][i_item]) return total + cur;
      return total;
    }, 0);
    setSubtotArr(subtotList);
    setAmount(arr => arr.map((v, i) => (i === CART_INDEX) ? total : v));
  }

  useEffect(() => {
    if (noData) return;

    updateTotal();
  }, [qtyArr, itemStateArr]);

  /**
   * 更新前台與後台之購物車商品數量
   * @param {number} i_item 商品類購物車中之 index
   * @param {number} cartID 
   * @param {number} delta 增減的數量
   */
  const handleQty = async (i_item, cartID, delta) => {
    // 更新前端的監控數據
    setQtyArr(qtyArr.map((q, j) => j === i_item ? q + delta : q));

    // 更新後台的資料庫
    //! 此時 qtyArr 的資料尚未被 set 更新
    const data = {
      quantity: qtyArr[i_item] + delta
    };
    await axios.patch(`${apiBaseUrl}/cart/${cartID}`, data).catch((err) => {
      if (err.response) {
        //status != 2XX
        console.error(err.response.data.message);
      } else if (err.request) {
        // 伺服器沒有回應
        console.log("伺服器沒有回應，請檢查伺服器狀態");
      } else {
        console.log("未知的錯誤情形");
        console.log(err);
      }
    });
  };

  const handleZero = () => {
    console.log('ㄟ，不能歸零');
  }

  //*========== 手機版事件 ==============================================
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  /** 判定為有效滑動的距離門檻 (px) */
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)

  const onTouchEnd = (e) => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe || isRightSwipe) console.log('向', isLeftSwipe ? '左' : '右', '滑了')

    // 以上為基本設定
    // todo: 滑動刪除
    if (isRightSwipe) {
      //? 我不知道怎麼抓 id
      ;
    }
  }
  //*========== 手機版事件 END ==============================================

  /** 刪除購物車資料 */
  const handleDelete = (i_item, db_id) => {
    // 更新前端的監控數據
    const new_arr = itemStateArr[CART_INDEX].map(
      (state, j_item) => i_item === j_item ? false : state
    );
    setItemStateArr(prev => prev.map(
      (arr, i_cart) => (i_cart === CART_INDEX) ? new_arr : arr)
    );
    updateTotal(new_arr);
    // 更新後台的資料庫
    deleteCartOf(db_id);
  }

  return (
    <>
      {w__screen >= breakpoints.md ? (
        <article className='my-5'>
          <header className='d-flex flex-row jc-between ai-center bg-tint5'>
            <span className='tx-default tx-shade4 ps-2 ps-lg-4'>
              共 {itemStateArr[CART_INDEX].filter(v => v).length} 件商品
            </span>
            <FddBtn color='tint5' pill={false} size='sm' href='/prod'>
              再逛一下商城
            </FddBtn>
          </header>
          <table className={s.cartTable}>
            <thead>
              <tr>
                <th className='d-none d-lg-table-cell'><TbTrashX /></th>
                <th></th>
                <th>商品資訊</th>
                <th>規格</th>
                <th style={{ width: '9rem' }}>單價</th>
                <th>數量</th>
                <th style={{ width: '9rem' }}>小計</th>
              </tr>
            </thead>
            <tbody className='tx-body'>
              {noData || data.map((item, i_item) => itemStateArr[CART_INDEX][i_item] && (
                <tr key={item.cart_id}>
                  <td className='d-none d-lg-table-cell'>
                    <FddBtn
                      color='tint4'
                      size='sm' icon
                      title="刪除此商品"
                      callback={() => handleDelete(i_item, item.cart_id)}
                    >
                      <RxCross2 />
                    </FddBtn>
                  </td>
                  <td>
                    <div className="img-wrap-h100" style={{ height: 100 }}>
                      <Image
                        src={'/pic-prod/' + item.pic_name}
                        width={0}
                        height={0}
                        alt={item.prod_name}
                      />
                    </div>
                  </td>
                  <td>{item.prod_name}</td>
                  <td>
                    {item.sort_name ? <p>{item.sort_name}</p> : <></>}
                    {item.spec_name ? <p>{item.spec_name}</p> : <></>}
                  </td>
                  <td>
                    <div className="mx-auto pe-1 tx-right w-fit">
                      ${item.price.toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <NumberPanel
                      quantity={qtyArr[i_item]}
                      callback={(q) => handleQty(i_item, item.cart_id, q)}
                      min={1}
                      onOverMin={() => handleZero()}
                      doesDisableMinus={qtyArr[i_item] <= 0}
                    />
                  </td>
                  <td>${subtotArr[i_item]}</td>
                </tr>
              ))}
              {noData && <tr><td colSpan={7}>
                <FddBtn color='tint1' size='sm' href='/prod'>來去逛逛寵物商城</FddBtn>
              </td></tr>}
            </tbody>
          </table>
        </article>) : (<>
          <div className="container mb-4">
            <div className="row jc-between bg-shade2 p-2">
              <h3 className='col-auto tx-white tx-center'>購物車 - 商品</h3>
              <p className='col-auto tx-tint4'>
                共 {itemStateArr[CART_INDEX].filter(v => v).length} 件商品
              </p>
            </div>
            {noData || data.map((item, i_item) => itemStateArr[CART_INDEX][i_item] && (
              <div
                key={item.cart_id}
                className={["row", s.cartRowMb].join(' ')}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div className="col-4 gr-center">
                  <div className="img-wrap-h100" style={{ height: 100 }}>
                    <Image
                      src={'/pic-prod/' + item.pic_name}
                      width={0}
                      height={0}
                      alt={item.prod_name}
                    />
                  </div>
                </div>
                <div className={["col-8 py-3", s.cartTableMb].join(' ')}>
                  <p>{item.prod_name}</p>
                  <p>
                    {
                      (item.sort_name && item.spec_name)
                        ? `${item.sort_name}、${item.spec_name}`
                        : (item.sort_name || item.spec_name)
                    }
                  </p>
                  <div className='hstack mt-3 jc-between'>
                    <NumberPanel
                      quantity={qtyArr[i_item]}
                      callback={(q) => handleQty(i_item, item.cart_id, q)}
                      min={1}
                      onOverMin={() => handleZero()}
                      doesDisableMinus={qtyArr[i_item] <= 0}
                    />
                    <span className='tx-sm tx-body'>小計：</span>
                    <div className='gr-center bg-white tx-body'
                      style={{
                        border: '1px solid rgb(120, 116, 115)',
                        width: '5rem',
                        height: '3rem',
                        paddingInline: 0
                      }}
                    >
                      <span>${Number(subtotArr[i_item]).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {noData &&
              <div className='row py-5'>
                <FddBtn color='tint1' size='sm' href='/prod'>來去逛逛寵物商城</FddBtn>
              </div>}
          </div>
        </>)}
    </>
  )
}
