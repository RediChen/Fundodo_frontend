import { breakpoints } from '@/configs';
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GoogleLogin } from '@react-oauth/google';
import useScreenWidth from '@/hooks/useScreenWidth';
import scss from './login.module.scss';
import Image from 'next/image';
import lfpic from '@/public/login.svg';
import pswd_icon from '@/public/memberPic/password-icon.svg';
import Head from 'next/head';
import { AuthContext } from '@/context/AuthContext';
import Link from 'next/link';
import Modal from '@/components/common/modal';
import { FcGoogle } from "react-icons/fc";
import FddBtn from '@/components/buttons/fddBtn';
import { IoMdHome } from "react-icons/io";
import useLocalStorage from '@/hooks/use-localstorage.js';

export default function LoginPage() {
  // 顯示密碼使用
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [storedValue, setValue] = useLocalStorage('redirFrom', '');
  const screenWidth = useScreenWidth();
  const [w__screen, setW__screen] = useState(1920);

  useEffect(() => {
    setW__screen(screenWidth);
  }, [screenWidth]);

  const openModal = () => {
    console.log('開啟 Modal');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('關閉 Modal');
    setIsModalOpen(false);
    setError(null);
  };

  const handleEmailChange = (e) => {
    setConfirmEmail(e.target.value);
  };

  //*============================ Modal for login
  const modalInitConfig = {
    active: false,
    style: 1,
    title: "",
    text: ""
  };
  const [loginModalConfig, setLoginModalConfig] = useState(modalInitConfig);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    fetch('http://localhost:3005/api/member/login', {
      method: 'POST',
      body: formData,
    }).then(async response => {
      const result = await response.json();
      if (!response.ok) {
        throw new Error(`${result.message}`);
      }
      return result;
    }).then(data => {
      console.log('回應數據:', data);
      if (data.status === 'success' && data.token) {
        // console.log('登入成功，準備呼叫 login() 和 router.push()');
        login(data.token);
        // alert('登入成功');
        // setLoginModalConfig({
        //   active: true,
        //   style: 1,
        //   title: "登入成功",
        //   text: ""
        // })
        // console.log('登入函數已呼叫，準備重定向');
        const path2redir = (storedValue) || '/member/peopleInfoData';
        console.log(storedValue);
        console.log(path2redir);
        setValue('');
        router.push(path2redir)
          .then(() => console.log('導航成功'))
          .catch((err) => console.error('導航失敗:', err));
      } else {
        setError(data.message || '登入失敗');
        // alert(`登入失敗:\n${data.message || '登入失敗'}`);
        setLoginModalConfig({
          active: true,
          style: 2,
          title: "登入失敗",
          text: ""
        })
      }
    }).catch(error => {
      setError(error.message);
    }).finally(() => {
      setLoading(false);
    });
  };

  const sendOTP = () => {
    fetch('http://localhost:3005/api/member/email/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: confirmEmail }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          alert('臨時密碼 已發送至您的電子信箱，請檢查您的電子信箱。');
          closeModal();
        } else {
          setError(data.message || '發送 臨時密碼 失敗');
        }
      })
      .catch(error => {
        setError(error.message || '發送 臨時密碼 失敗');
      });
  };


  const handleGoogleSuccess = (response) => {
    const { credential } = response;

    fetch('http://localhost:3005/api/member/google_login/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: credential }),
    })
      .then(response => {
        console.log('API Response:', response);
        return response.json();
      })
      .then(data => {
        console.log('API Data:', data);
        if (data.status === 'success' && data.data && data.data.accessToken) {
          localStorage.setItem('accessToken', data.data.accessToken);
          login(data.data.accessToken);
          router.push('/member/peopleInfoData');
        } else {
          alert(data.message || '登入失敗');
          setError(data.message || '登入失敗');
        }
      })
      .catch(error => {
        console.error('Fetch Error:', error);
        alert(error.message || '登入失敗');
        setError(error.message || '登入失敗');
      });
  };

  return (
    <>
      <Head><title>會員登入 | Fundodo</title></Head>
      <main>
        <div className={['row jc-center', scss.LoginContainer].join(' ')}>
          <div className="col-6 d-none d-lg-block">
            <div className={["img-wrap-w100 fx-center", scss.lfpic].join(' ')}>
              <Image className="imgWrap" width={0} height={0} src={lfpic} alt="Image" />
            </div>
          </div>
          <div className={`${scss.rightText} col-12 col-lg-6`}>
            <div className={scss.rightBody}>
              <div>
                <h4 className={`${scss.formTitle} tx-lg`}>歡迎回來</h4>
              </div>
              <form onSubmit={handleLogin}>
                <div className={scss.inputBox}>
                  <label>電子信箱</label>
                  <input type="email" name="email" required />
                </div>
                <div className={scss.inputBox}>
                  <div className={scss.pwdLabel}>
                    <label>密碼</label>
                    <div onClick={() => setShowPassword(!showPassword)}>
                      <Image src={pswd_icon} alt="Image" />
                      <span>隱藏</span>
                    </div>
                  </div>
                  <input type={showPassword ? 'text' : 'password'} name="password" required />
                  {/* <p>使用8個或以上的字元, 包含字母數字和符號</p> */}
                  {error && (
                    <div className={scss.errorMessage}>
                      {error}
                    </div>
                  )}
                </div>
                <div className={`${scss.area4} col-12`}>
                  <button className={scss.createBtn} type="submit"
                    disabled={loading}>{loading ? '登入中...' : '登入'}</button>
                </div>
              </form>
              <FddBtn color='primary' outline
                className={scss.toRegisterBtn}
                href="/member/register"
              >
                註冊會員
              </FddBtn>
              <div className={scss.GoogleBtnWrap}>
                <GoogleLogin
                  width={w__screen >= breakpoints.lg ? 352 : 267}
                  shape='pill'
                  onSuccess={handleGoogleSuccess}
                  onError={(error) => setError(error.message)}
                />
              </div>
              <div className={`${scss.area3} col-12`}>
                <p onClick={openModal}> 忘記密碼?</p>
                <Link href="/member/login_BackEnd"><div className={scss.Backend_Btn}>後台</div></Link>
                {/* <FddBtn color='info' className={scss.Backend_Btn} pill={false} size='sm' href="/member/login_BackEnd">後台</FddBtn> */}
              </div>
              <Link href="/home"><div className={scss.xBtn}><IoMdHome /></div></Link>
            </div>
          </div>
        </div>
        <Modal
          mode={1}
          active={isModalOpen}
          onClose={closeModal}
          confirmText="發送 臨時密碼"
          cancelText="取消"
        >
          <h4>忘記密碼</h4>
          <p>請輸入你的電子信箱，我們將發送臨時密碼。</p>
          <input
            type="email"
            value={confirmEmail}
            onChange={handleEmailChange}
            placeholder="輸入您的電子信箱"
          />
          <button onClick={sendOTP} disabled={!confirmEmail}>
            發送
          </button>
          <button onClick={closeModal}>取消</button>
        </Modal>
        <Modal
          mode={1}
          active={loginModalConfig.active}
          style={loginModalConfig.style}
          onClose={() => switchModal(0)}
        >
          <h4>{loginModalConfig.title}</h4>
          <p>{loginModalConfig.text}</p>
        </Modal>
      </main>
    </>
  );
}
