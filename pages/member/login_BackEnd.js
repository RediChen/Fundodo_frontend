import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { GoogleLogin } from '@react-oauth/google';
import scss from './login_BackEnd.module.scss';
import Image from 'next/image';
import lfpic from '@/public/adminBg.svg';
import pswd_icon from '@/public/memberPic/password-icon.svg';
import { AuthContext } from '@/context/AuthContext';
import Link from 'next/link';
import Head from 'next/head';
import Modal from '@/components/common/modal';
import { FcGoogle } from "react-icons/fc";
import FddBtn from '@/components/buttons/fddBtn';
import { IoMdHome } from "react-icons/io";
export default function LoginBackEndPage() {
  // 顯示密碼使用
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [confirmEmail, setConfirmEmail] = useState('');

  const handleEmailChange = (e) => {
    setConfirmEmail(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    fetch('http://localhost:3005/api/member/login_BackEnd', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(`${errorData.message}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('回應數據:', data);
        if (data.status === 'success' && data.token) {
          console.log('登入成功，準備呼叫 login() 和 router.push()');
          login(data.token);
          alert('登入成功');
          console.log('登入函數已呼叫，準備重定向');
          router.push('/backend')
            .then(() => console.log('導航成功'))
            .catch((err) => console.error('導航失敗:', err));
        } else {
          setError(data.message || '登入失敗');
          alert(`登入失敗:\n${data.message || '登入失敗'}`);
        }
      })
      .catch(error => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  return (
    <>
      <Head><title>後台登入 | Fundodo</title></Head>
      <main className={scss.Loginmain}>
        <div className={scss.LoginContainer}>
          <div className={`${scss.lfpic} col-6`}>
            <Image className="imgWrap" src={lfpic} alt="Image" />
          </div>
          <div className={`${scss.rightText} col-6`}>
            <div className={`${scss.area1} col-12`}>
              <p className={scss.h5}>歡迎回來</p>
            </div>
            <form onSubmit={handleLogin}>
              <div className={`${scss.area2} col-12`}>
                <label>電子郵件地址</label>
                <input type="email" name="email" required />
                <div>
                  <div className={scss.passwordarea}>
                    <div><label>密碼</label></div>
                    <div className={scss.passwordicon} onClick={() => setShowPassword(!showPassword)}>
                      <div className={scss.point}>
                        <Image className="imgWrap" src={pswd_icon} alt="Image"
                        />隱藏</div>
                    </div></div>
                  <input type={showPassword ? 'text' : 'password'} name="password" required />
                  {error && (
                    <div className={scss.errorMessage}>
                      {error}
                    </div>
                  )}
                </div>
              </div>
              <div className={`${scss.area3} col-12`}>
                {/* <div className={scss.Backend_Btn} >會員登入頁</div> */}
                {/* <FddBtn color='info' className={scss.Backend_Btn} size='sm' href="/member/login">會員登入頁</FddBtn> */}
                <Link href="/member/login"><div className={scss.Backend_Btn}>登入頁</div></Link>
              </div>
              <div className={`${scss.area4} col-12`}>
                <button className={scss.createBtn} type="submit"
                  disabled={loading}>{loading ? '登入中...' : '登入'}
                </button>
              </div>
              <Link href="/home"><div className={scss.xBtn}><IoMdHome /></div></Link>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
