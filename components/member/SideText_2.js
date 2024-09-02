import React, { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoMdPerson } from 'react-icons/io';
import { MdLock } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import mdi_coupon from '@/public/memberPic/mdi_coupon.svg';
import mdi_dog from '@/public/memberPic/mdi_dog.svg';
import { AuthContext } from '@/context/AuthContext';
import styles from './side2.module.scss';

const SideText = ({ activeIndex = 0 }) => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { 
      icon: <IoMdPerson />, 
      text: '會員中心', 
      link: '/member/peopleInfoData',
      subItems: [
        { text: '基本資料', link: '/member/peopleInfoData' },
        { text: '討論區會員', link: '/member/ForumMemberInfo' },
      ]
    },
    { icon: <Image src={mdi_dog} alt="狗狗管理" />, text: '狗狗管理', link: '/member/dogInfoData' },
    { icon: <Image src={mdi_coupon} alt="訂單查詢" />, text: '訂單查詢', link: '#' },
    { icon: <MdLock />, text: '修改密碼', link: '/member/ChangePassword' },
    { icon: <FaHeart />, text: '我的收藏', link: '/prod/list/favoriteProd' },
  ];

  return (
    <div className={styles.sideText}>
      <nav>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className={activeIndex === index ? styles.active : ''}>
              <Link href={item.link} className={styles.menuItem}>
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.text}>{item.text}</span>
              </Link>
              {item.subItems && activeIndex === index && (
                <ul className={styles.subMenu}>
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link href={subItem.link}>{subItem.text}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SideText;