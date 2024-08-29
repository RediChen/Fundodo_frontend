//== Parameters ================================================================
import { apiBaseUrl } from '@/configs';
import dataEmergency from '@/data/cart-emergency.json';
//== Functions =================================================================
import { useState, useEffect } from 'react';
import axios from 'axios';
import tokenDecoder from '@/context/token-decoder';
//== Components ================================================================
import ProdCartTable from './ProdCartTable';
import HotelCartTable from './HotelCartTable';
import CrsCartTable from './CrsCartTable';
//== Styles =================================================================
import s from "./cart-page.module.scss";
import emptyCart from '@/public/cart/dog-in-cart.jpg';
import Image from 'next/image';
import FddBtn from '@/components/buttons/fddBtn';

//todo 從訂購階段返回的情況應對機制尚未處理

/** 商品三種類
 * ['PD', 'HT', 'CR']
 */
const SORT_LIST = ['PD', 'HT', 'CR'];

export default function CartPage({
  setBuyPhase = () => { },
  setBuyInfoPkg = () => { }
}) {
  //=============== useState 區
  //=============== user ID ====================================================
  /**
   * user ID
   *  @type {[number, React.Dispatch<number>]} */
  const [uID, setUID] = useState(0);

  //=============== coupon =====================================================
  // 遠目之 todo: 若折數型的優惠券有兩張以上，此機制皆會以原價為基數；而非作連續相乘
  // 若要解決此困境，有個想法是：將 cpList 依折數型、折抵型分為兩個陣列

  /**
   * 優惠券 info
   *  @type {[object[], React.Dispatch<object[]>]} */
  const [cpList, setCpList] = useState([]);
  /**
   * 優惠券折扣金額
   *   @type {[number[], React.Dispatch<number[]>]} */
  const [couponDc, setCouponDc] = useState([]);
  /**
   * 優惠券啟用狀態
   *   @type {[boolean[], React.Dispatch<boolean[]>]} */
  const [cpState, setCpState] = useState([]);

  /**
   * 總折扣金額
   * @type {[number, React.Dispatch<number>]} */
  const [discount, setDiscount] = useState(0);

  /**
   * 總運費
   *  @type {[number, React.Dispatch<number>]} */
  const [dlvFee, setDlvFee] = useState(0);

  //=============== cart items =================================================
  /**
   * 購物車資料
   *  @type {[object, React.Dispatch<object>]} */
  const [cartPkg, setCartPkg] = useState({ PD: [], HT: [], CR: [] })

  /** 三台購物車各自的刪除狀態紀錄
   * true | 正常狀態 ; false | 自購物車刪除
   *  此陣列在購物車資料讀取完畢後初始化
   * */
  /** @type {[ boolean[][], React.Dispatch<boolean[][]> ]} */
  const [itemStateArr, setItemStateArr] = useState([[], [], []]);

  /**
   * 三台購物車各自的總金額
   * 0 - PD | product
   * 1 - HT | hotel
   * 2 - CR | course
   *  @type {[number, React.Dispatch<number>]} */
  const [amtArr, setAmtArr] = useState([0, 0, 0]);

  // 三台購物車合算的總金額
  // totalArr[0] | 商品總金額
  // totalArr[1] | 實付總金額
  const [totalArr, setTotalArr] = useState([0, 0]);

  //=============== useState 區 END
  //============================================================//
  //=============== useEffect 區


  //===== 解讀登入的會員 ID
  useEffect(() => {
    const { userId } = tokenDecoder();
    setUID(userId);
  }, [])
  //===== 以會員 ID 索取購物車資料，建構購物車初始資料
  useEffect(() => {
    if (uID === 0) return;

    const CancalToken = axios.CancelToken;//中止情況用的信號彈
    const source = CancalToken.source();

    //以下寫法參考 Axios 官方文件
    axios.get(`${apiBaseUrl}/cart/${uID}`, { cancelToken: source.token })
      .then(res => {
        // 略過將之前被刪除的購物車項目
        //===== 可以避免購物車在回復刪除階段時，將重複品項救回
        const dataPkg = res.data.result;
        const PD_pkg = dataPkg.PD ? dataPkg.PD.filter(item => !item.deleted_at) : [];
        const HT_pkg = dataPkg.HT ? dataPkg.HT.filter(item => !item.deleted_at) : [];
        const CR_pkg = dataPkg.CR ? dataPkg.CR.filter(item => !item.deleted_at) : [];

        setCartPkg({ PD: PD_pkg, HT: HT_pkg, CR: CR_pkg, });

        // 有商品就預設運費 60 元
        if (PD_pkg.length > 0) setDlvFee(60);

        // 表列每個購物車項目是否被（軟）刪除的狀態
        setItemStateArr([
          Array(PD_pkg.length).fill(true),
          Array(HT_pkg.length).fill(true),
          Array(CR_pkg.length).fill(true),
        ]);
      })
      .catch(err => {
        if (axios.isCancel(err)) {
          console.log('此請求已成功取消');
          return;
        }

        console.log("未得到如預期的回應，已啟用備援資料");
        setCartPkg(dataEmergency);
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

    return () => {
      //取消 API request
      // 主要在為了在 API 還沒跑完的時間點，使用者就離開頁面的情況
      // 避免 API 無法正常結束
      source.cancel("API 請求已被臨時取消");
    }
  }, [uID])

  //===== 以會員 ID 索取優惠券資料
  useEffect(() => {
    //0 | 預設值；null | token 解譯失敗
    if (!uID) return;

    const CancalToken = axios.CancelToken;//中止情況用的信號彈
    const source = CancalToken.source();

    //以下寫法參考 Axios 官方文件
    axios.get(`${apiBaseUrl}/coupon/${uID}`, { cancelToken: source.token })
      .then(res => {
        // 略過將之前被刪除的購物車項目
        //===== 可以避免購物車在回復刪除階段時，將重複品項救回
        setCpList(res.data.result.usableArr);
      })
      .catch(err => {
        if (axios.isCancel(err)) {
          console.log('此請求已成功取消');
          return;
        }

        console.log("未得到如預期的回應，已啟用備援資料");
        setCpList([]);
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

    return () => {
      //取消 API request
      // 主要在為了在 API 還沒跑完的時間點，使用者就離開頁面的情況
      // 避免 API 無法正常結束
      source.cancel("API 請求已被臨時取消");
    }
  }, [uID])

  //===== 以優惠券資料建立初始狀態
  useEffect(() => {
    if (cpList.length === 0 || !(cartPkg.CR || cartPkg.HT || cartPkg.CR)) return;

    // 預設皆不啟動
    const initState = Array(cpList.length).fill(0);
    let verified = initState;
    SORT_LIST.forEach(sort => {
      if (cartPkg[sort].length === 0) {
        verified = verified.map((s, i_cp) => {
          if (cpList[i_cp].scope_from === sort || cpList[i_cp].scope_to === sort)
            return -1;
          else
            return s;
        });
      }
    });
    setCpState(verified);
  }, [cpList, cartPkg])

  //===== 以購物車內容更新折扣金額

  /**
   * 處理包括買旅館折商品的方案
   * @param {object} coupon 優惠券資料包
   * @param {number} amt_base 計算基準
   * @returns {number} 折扣的金額
   */
  const handleDiscount = (coupon, amt_base) => {
    const i_sort = SORT_LIST.indexOf(coupon.scope_from);

    if (i_sort !== -1) {
      // 如果前置條件的商品沒有購買，則優惠不會生效
      if (amtArr[i_sort] === 0) return 0;
    } else {
      // TODO:擱置，商品如飼料的細項目前暫無施工計畫
    }

    const { max_discount, discount } = coupon;
    const price_cut = Number(discount);

    let cut = 0;
    if (price_cut > 1) {
      cut = price_cut;
    } else {
      cut = Math.floor(amt_base * (1 - price_cut));
    }
    return max_discount ? Math.min(cut, max_discount) : cut;
  }

  useEffect(() => {
    const dcArr = cpList.map(coupon => {
      let delta = 0
      switch (coupon.scope_to) {
        case null:
          delta = handleDiscount(coupon, totalArr[0]);
          break;
        case 'PD':
          if (amtArr[0] === 0) break;
          delta = handleDiscount(coupon, amtArr[0]);
          break;
        case 'HT':
          if (amtArr[1] === 0) break;
          delta = handleDiscount(coupon, amtArr[1]);
          break;
        case 'CR':
          if (amtArr[2] === 0) break;
          delta = handleDiscount(coupon, amtArr[2]);
          break;
        default:
          // TODO:擱置，商品如飼料的細項目前暫無施工計畫
          break;
      }
      return delta;
    });
    setCouponDc(dcArr);
  }, [amtArr]);

  //===== 以優惠券狀態結算折扣總金額
  useEffect(() => {
    if (cpState.some(v => v)) {
      const tot = couponDc.reduce((acc, cur, j) => {
        if (cpState[j] === 1) return acc + cur;
        else return acc
      }, 0);
      setDiscount(0 - tot);
    } else {
      setDiscount(0);
    }

  }, [cpState, couponDc]);

  //===== 計算總購物車總金額
  useEffect(() => {
    setTotalArr([
      amtArr.reduce((sum, subtotal) => sum + subtotal, 0),
      amtArr.reduce((sum, subtotal) => sum + subtotal, dlvFee + discount),
    ]);
  }, [amtArr, dlvFee, discount]);

  //=============== useEffect 區 END
  //============================================================//

  /** 優惠券按鈕的顏色切換樞
   * 判斷 cpState 以決定該按鈕的狀態與顏色
   * 狀態有三：啟動、未啟動、無法使用
   */
  const colorIndicator = (j) => {
    switch (cpState[j]) {
      case 0:
        return 'shade2';
      case 1:
        return 'warning';
      case -1:
        return 'muted';
      default:
        return 'error';
    }
  }

  const handleCpBtn = j => {
    switch (cpState[j]) {
      case 0:
        setCpState(cpState.map((v, i) => i === j ? 1 : v))
        return;
      case 1:
        setCpState(cpState.map((v, i) => i === j ? 0 : v))
        return;
      case -1:
      default:
        setCpState(cpState.map(v => v))
        return;
    }
  }

  const goNextPhase = () => {
    setBuyInfoPkg(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      //*===== 打包優惠券資訊: coupon_user IDs
      copy.coupons = cpState
        .map((isActive, i_cp) => isActive ? cpList[i_cp].id : null)
        .filter(v => v);

      //*===== 打包購買品項資訊: 訂單所需及 cart IDs
      copy.buyItems = itemStateArr.flatMap(
        (arr, i_sort) => arr.map((isActive, i_cart) => {
          if (!isActive) return null;

          const sKey = SORT_LIST[i_sort];
          const cartItem = cartPkg[sKey][i_cart];
          return {
            purchase_sort: sKey,
            purchase_id: cartItem.buy_id,
            purchase_price: i_sort === 1 ? null : cartItem.price,
            cart_id: cartItem.id,
            room_type: i_sort === 1 ? cartItem.room_type : ''
          };
        })
      ).filter(v => v);

      //*===== 打包訂單所需資訊: 總金額及 user ID
      copy.orderInfo = {
        ...copy.orderInfo,
        user_id: uID,
        amount: totalArr[1],
      }

      return copy;
    })
    setBuyPhase(2);
  }


  /** 購物車是否全空 */
  const isEmpty = !(SORT_LIST.some(s => cartPkg[s]))
    || !itemStateArr.reduce(
      (indicator, currentArr) => indicator || currentArr.some(v => v),
      false);

  return (
    <>

      {isEmpty || <>
        <section className="container mt-5">
          {[ProdCartTable, HotelCartTable, CrsCartTable].map((Component, i) => (
            <Component
              key={i}
              data={cartPkg[SORT_LIST[i]]}
              itemStateArr={itemStateArr[i]}
              setItemStateArr={setItemStateArr}
              setAmount={setAmtArr}
            />
          ))}
          <div className='d-flex jc-end'>
            <FddBtn color='primary' pill={false} href='/prod'>
              繼續購物
            </FddBtn>
          </div>
          <article className={['row', s.orderInfo].join(' ')}>
            <div className="col-12 col-lg-8">
              <div className="bg-secondary p-3 h-100">
                <div className="hstack jc-between mb-3">
                  <h3>
                    {cpList.length > 0
                      ? "所有可使用的優惠券"
                      : "沒有可使用的優惠券"}</h3>
                  <FddBtn color='tint3' size='sm' href='/member/coupon'>查看我的優惠券</FddBtn>
                </div>
                <div className="hstack flex-wrap gap-1 jc-between">
                  {cpList.map((coupon, i_cp) => (
                    <FddBtn
                      key={coupon.code}
                      size='sm'
                      color={colorIndicator(i_cp)}
                      callback={() => handleCpBtn(i_cp)}
                    >
                      <p className='tx-left'>{coupon.name}</p>
                      <p className='tx-primary' style={{ position: 'absolute', top: '0.5rem', right: '1rem' }}>{coupon.code}</p>
                      <p>{coupon.desc}</p>
                    </FddBtn>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <table>
                <thead>
                  <tr>
                    <th>訂單資訊</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>商品金額</th>
                    <td>NT ${totalArr[0]}</td>
                  </tr>
                  <tr>
                    <th>運費</th>
                    <td>NT ${dlvFee}</td>
                  </tr>
                  <tr>
                    <th>優惠折扣</th>
                    <td>NT ${discount}</td>
                  </tr>
                  <tr>
                    <th>結帳金額</th>
                    <td>NT ${totalArr[1]}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <FddBtn color='shade2' pill={false} className={s.payBtn} callback={goNextPhase}>前往結帳</FddBtn>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </>}
      {isEmpty &&
        <section className="container pt-3">
          <h4 className='my-5 tx-lg tx-shade3 tx-center'>現在購物車空無一物</h4>
          <div className='hstack jc-around'>
            <FddBtn color='tint1' size='sm' href='/course'>來去逛逛寵物商城</FddBtn>
            <FddBtn color='tint1' size='sm' href='/course'>來去逛逛寵物旅館</FddBtn>
            <FddBtn color='tint1' size='sm' href='/course'>來去逛逛寵物課程</FddBtn>
          </div>
          <div className='img-wrap-w100 mx-auto' style={{ width: '40vw' }}>
            <Image src={emptyCart} alt="empty cart" width={0} height={0} />
          </div>
        </section>}
    </>
  );
};