import React, { useState, useEffect, useCallback } from 'react';
import styles from './selectDetail.module.scss';
import { RiCoupon2Line } from "react-icons/ri";


export default function SelectDetail({ hotelCode }) {
  const [hotel, setHotel] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [nightCount, setNightCount] = useState(1);
  const [roomType, setRoomType] = useState('');
  const [roomTypeCode, setRoomTypeCode] = useState('');
  const [roomCount, setRoomCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const getHotel = async () => {
      const baseURL = `http://localhost:3005/api/hotel/detail/${hotelCode}`;
      const res = await fetch(baseURL);
      const data = await res.json();
      if (data.status === "success" && data.data) {
        setHotel(data.data);
        // 設置初始價格為小型犬的價格
        setTotalPrice(parseInt(data.data.price_s));
      }
    };

    if (hotelCode) {
      getHotel();
    }
  }, [hotelCode]);

  //依照選擇日期計算幾晚+審查機制
  const handleDateChange = useCallback((e, type) => {
    const date = e.target.value;
    if (type === 'checkIn') {
      setCheckInDate(date);
      //退房日早於入住日就清空退房日
      if(checkOutDate && date > checkOutDate) {
        setCheckOutDate('');
      }
    } else if (type === 'checkOut'){
      //確保退房不早於入住
      if(date < checkInDate) {
        alert('退房需晚於入住日')
        return;
      }
      setCheckOutDate(date);
    }
  }, [checkInDate, checkOutDate]);

  const calculateNights = useCallback((checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  }, []);

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const nights = calculateNights(checkInDate, checkOutDate);
      setNightCount(nights);
    }
  }, [checkInDate, checkOutDate, calculateNights]);

  const handleRoomTypeChange = useCallback((type) => {
    setRoomType(type);

 switch(type) {
    case '小型犬':
      setRoomTypeCode('S');
      break;
    case '中型犬':
      setRoomTypeCode('M');
      break;
    case '大型犬':
      setRoomTypeCode('L');
      break;
    default:
      setRoomTypeCode('');
  }
}, []);
  
//切換房型的style
  const getWeightRangeClass = (type) => roomType === type ? styles.active : '';

  const handleRoomCountChange = useCallback((e) => {
    setRoomCount(Number(e.target.value));
  }, []);

  const calculatePrice = useCallback(() => {
    if (!hotel || !roomType) return totalPrice; // 如果沒有選擇房型，返回當前總價

    let price;
    switch (roomType) {
      case '小型犬':
        price = parseInt(hotel.price_s);
        break;
      case '中型犬':
        price = parseInt(hotel.price_m);
        break;
      case '大型犬':
        price = parseInt(hotel.price_l);
        break;
      default:
        price = parseInt(hotel.price_s);
    }

    const nights = calculateNights(checkInDate, checkOutDate);
    return price * nights * roomCount;
  }, [hotel, roomType, checkInDate, checkOutDate, roomCount, calculateNights, totalPrice]);

  //依照天數房型計算房價
  useEffect(() => {
    if (hotel && roomType) {
      const newPrice = calculatePrice();
      setTotalPrice(newPrice);
      setNightCount(calculateNights(checkInDate, checkOutDate));
    }
  }, [hotel, checkInDate, checkOutDate, roomType, roomCount, calculatePrice, calculateNights]);


  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getMonth() + 1} 月 ${date.getDate()}日`;
  };

  //放入購物車
  const handleBooking = async () => {
    if(!checkInDate || !checkOutDate || !roomType || !roomCount) {
      alert('訂房資訊尚未選取完成');
      return;
    }

  //cart api
  const bookingData = {
    user_id: 13, //從會員資料來
    dog_id: null,
    buy_sort: "HT",
    buy_id: hotelCode,
    amount: totalPrice,
    room_type: roomTypeCode,
    check_in_date: checkInDate,
    check_out_date: checkOutDate,
  };

  try {
    const response = await fetch('http://localhost:3005/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });

    if(!response.ok) {
      throw new Error('加入購物車失敗');
    }

    const result = await response.json();

    console.log('成功加入購物車:', result);
    alert('已成功加入購物車');

  } catch (error) {
    console.error('加入購物車失敗:', error);
    alert('加入購物車失敗，請稍後再試')
  }
};


  //座標格式

  // useEffect(() => {
  //   if (hotel) {
  //     console.log('Latitude:', hotel.latitude);
  //     console.log('Longitude:', hotel.longitude);
  //   }
  // }, [hotel]);

  //座標帶入地圖
  // const generateMapUrl = (latitude, longitude) => {
  //   const lat = parseFloat(latitude);
  //   const lng = parseFloat(longitude);

  //   if (isNaN(lat) || isNaN(lng)) {
  //     console.error('無法辨識的座標格式');
  //     return '';
  //   }
  //   return `https://www.google.com/maps/embed/v1/place?key=AIzaSyA4mbO2oQzhqWA7b8QDCOsOFp67LP9kjdY&q=${lat.toFixed(6)},${lng.toFixed(6)}`;
  // };


  return (
    <>
      {hotel && (
        <>
          <div className={styles.wrap}>
            <div className={styles.info}>
              <h2 className={styles.title}>{hotel.name}</h2>
              <p className={styles.address}>{hotel.address}</p>
              <p className={styles.date}>
                {nightCount}晚房價 ({formatDate(checkInDate)} ~ {formatDate(checkOutDate)})
              </p>
              <h1 className={styles.price}>
                ${totalPrice}
              </h1>
              <p className={styles.detail}>含稅費及其他費用</p>
            </div>

            <div className={styles.coupon}>
              <span className={styles.couponIcon}><RiCoupon2Line /></span>
              專屬優惠券 NT$ 50
            </div>

            <div className={styles.select}>
              <div className={styles.selectContainer}>
                <div className={styles.detailTitle}>
                  <p>入住日</p>
                  <p>退房日</p>
                </div>
                <input type="date" value={checkInDate} onChange={(e) => handleDateChange(e, 'checkIn')} />
                <input type="date" value={checkOutDate} onChange={(e) => handleDateChange(e, 'checkOut')} />
              </div>
              <div className={styles.detailTitle}>
                <p>房型</p>
              </div>
              <div className={styles.roomTypeButtons}>
                <button
                  className={`${styles.roomTypeButton} ${roomType === '小型犬' ? styles.active : ''}`}
                  onClick={() => handleRoomTypeChange('小型犬')}
                >
                  小型犬 <br />
                  <span className={`${styles.weightRange} ${getWeightRangeClass('小型犬')}`}>
                    (10公斤以下)
                  </span>
                </button>

                <button
                  className={`${styles.roomTypeButton} ${roomType === '中型犬' ? styles.active : ''}`}
                  onClick={() => handleRoomTypeChange('中型犬')}
                >
                  中型犬 <br />
                  <span className={`${styles.weightRange} ${getWeightRangeClass('中型犬')}`}>
                    (10公斤~25公斤)
                  </span>
                </button>

                <button
                  className={`${styles.roomTypeButton} ${roomType === '大型犬' ? styles.active : ''}`}
                  onClick={() => handleRoomTypeChange('大型犬')}
                >
                  大型犬 <br />
                  <span className={`${styles.weightRange} ${getWeightRangeClass('大型犬')}`}>
                    (25公斤以上)
                  </span>
                </button>
              </div>
              <div className={styles.detailTitle}>
                <p>間數</p>
              </div>
              <select className={styles.petSelect} value={roomCount} onChange={handleRoomCountChange}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <div>
                <button className={styles.btn} onClick={handleBooking}>立即預定</button>
              </div>
            </div>

            <div className={styles.map} >
              {/* 固定的 */}
              <iframe
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyA4mbO2oQzhqWA7b8QDCOsOFp67LP9kjdY&q=24.99610300,121.29479900"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              {/* 測試的 */}
              {/* <iframe
                width="450"
                height="250"
                frameBorder="0"
                style={{ border: 0 }}
                referrerPolicy="no-referrer-when-downgrade"
                src={hotel ? generateMapUrl(hotel.latitude, hotel.longitude) : ''}
                allowFullScreen=""
                loading="lazy"
              ></iframe> */}

            </div>
          </div>

          {/* 手機版 */}

          <div className={styles.wrapMobile}>
            <h2 className={styles.title}>{hotel.name}</h2>
            <div className={styles.infoGrid}>
              <div>
                <p className={styles.label}>入住時間</p>
                <p className={styles.value}>7月10日週三</p>
              </div>
              <div>
                <p className={styles.label}>退房時間</p>
                <p className={styles.value}>7月11日週四</p>
              </div>

              <div className={styles.roomInfo}>
                <p className={styles.label}>房間數與狗狗數量</p>
                <p className={styles.value}>2間房 - 大型犬 1，中型犬 1</p>
              </div>
            </div>

            <div className={styles.priceInfo}>
              <p className={styles.date}>1晚房價 (7月10日~ 7月11日)</p>
              <h1 className={styles.price}>
                ${hotel.price_s}~${hotel.price_l}
              </h1>
              <p className={styles.detail}>含稅費及其他費用</p>
            </div>

            <div className={styles.coupon}>
              <span className={styles.couponIcon}><RiCoupon2Line /></span>
              專屬優惠券 NT$ 50
            </div>

            <div className={styles.map} />
            <iframe
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyA4mbO2oQzhqWA7b8QDCOsOFp67LP9kjdY&q=24.99610300,121.29479900"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <p className={styles.address}>{hotel.address}</p>
          </div>
        </>
      )}
    </>
  );
}
