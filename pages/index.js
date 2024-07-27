import Head from 'next/head';
import Link from 'next/link';
// import style from '@/styles/style.module.scss';
import FddBtn from '@/components/buttons/fddBtn';
import hs from './devHome.module.scss';
import { IconContext } from 'react-icons';
import { FaArrowRightLong } from 'react-icons/fa6';
import { IoAddCircle } from 'react-icons/io5';

export default function Home() {
  return (
    <>
      <Head>
        <title>首頁 | 開發用</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <IconContext.Provider
        value={{ style: { marginInline: '1rem', verticalAlign: 'middle' } }}
      >
        <main className="bgLight row">
          <section>
            <h1 className="txCenter">這是開發用的首頁</h1>
            <h2 className="txCenter">通往各開發中頁面的捷徑</h2>
            <div className="container">
              <div className={`${hs.linkPanel} row g3`}>
                <div className="col6 col_lg4">
                  <Link href="">首頁</Link>
                </div>
                <div className="col6 col_lg4">
                  <Link href="/prod">商品</Link>
                </div>
                <div className="col6 col_lg4">
                  <Link href="">會員</Link>
                </div>
                <div className="col6 col_lg4">
                  <Link href="">旅館</Link>
                </div>
                <div className="col6 col_lg4">
                  <Link href="">文章</Link>
                </div>
                <div className="col6 col_lg4">
                  <Link href="">課程</Link>
                </div>
                <div className="col6 col_lg4">
                  <Link href="/test/">測試用</Link>
                </div>
              </div>
            </div>
          </section>
          <section className="container">
            <h1 className="txCenter">開發指南</h1>
            <div className="row">
              <article className="col12 col_lg6">
                <h2 className="txCenter">可以使用的樣式</h2>
                <p className="txCenter">
                  Bootstrap 的語法
                  <FaArrowRightLong />
                  Fundodo 專案的語法
                </p>
                <div className={hs.dlBox}>
                  <dl className={hs.instructionList}>
                    <dt className="txCenter">背景、文字顏色</dt>
                    <dd>
                      <span>.bg-primary</span>
                      <FaArrowRightLong />
                      <code>.bgPrimary</code>
                    </dd>
                    <dd>
                      <span>.bg-secondary</span>
                      <FaArrowRightLong />
                      <code>.bgSecondary</code>
                    </dd>
                    <dd>
                      <span>.text-primary</span>
                      <FaArrowRightLong />
                      <code>.txPrimary</code>
                    </dd>
                    <dd>
                      <span>.text-danger</span>
                      <FaArrowRightLong />
                      <code>.txError</code>
                    </dd>
                  </dl>
                  <dl className={hs.instructionList}>
                    <dt className="txCenter">grid system</dt>
                    <dd>
                      <span>.col-6</span>
                      <FaArrowRightLong />
                      <code>.col6</code>
                    </dd>
                    <dd>
                      <span>.col-md-6</span>
                      <FaArrowRightLong />
                      <code>.col_md6</code>
                    </dd>
                    <dd>
                      <span>.row-cols-4</span>
                      <FaArrowRightLong />
                      <code>.rowCols4</code>
                    </dd>
                  </dl>
                  <dl className={hs.instructionList}>
                    <dt className="txCenter">置中</dt>
                    <dd>
                      <span>.text-center</span>
                      <FaArrowRightLong />
                      <code>.txCenter</code>
                    </dd>
                    <dd>
                      <span>以 flex 置中</span>
                      <FaArrowRightLong />
                      <code>.fxCenter</code>
                    </dd>
                    <dd>
                      <span>以 grid 置中</span>
                      <FaArrowRightLong />
                      <code>.grCenter</code>
                    </dd>
                  </dl>
                  <dl className={hs.instructionList}>
                    <dt className="txCenter">flex 相關</dt>
                    <dd>
                      <span>.d-flex</span>
                      <FaArrowRightLong />
                      <code>.dFlex</code>
                    </dd>
                    <dd>
                      <span>.justify-content-center</span>
                      <FaArrowRightLong />
                      <code>.jcCenter</code>
                    </dd>
                    <dd>
                      <span>.justify-content-around</span>
                      <FaArrowRightLong />
                      <code>.jcAround</code>
                    </dd>
                    <dd>
                      <span>.justify-content-between</span>
                      <FaArrowRightLong />
                      <code>.jcBetween</code>
                    </dd>
                    <dd>
                      <span>.justify-content-evenly</span>
                      <FaArrowRightLong />
                      <code>.jcEvenly</code>
                    </dd>
                  </dl>
                </div>
              </article>
              <article className="col12 col_lg6">
                <h2 className="txCenter">按鈕元件</h2>
                <p className="txCenter">
                  Bootstrap 的語法
                  <FaArrowRightLong />
                  實際的樣式
                  <FaArrowRightLong />
                  Fundodo 專案的語法
                </p>
                <dl className={hs.instructionList}>
                  <dt>一般按鈕</dt>
                  <dd>
                    <p>
                      <span>.btn-primary</span>
                      <FaArrowRightLong />
                      <FddBtn href="#">人家是按鈕</FddBtn>
                    </p>
                    <p>
                      <FaArrowRightLong />
                      <code
                        className={[hs.bgDark, hs.txSecondary].join(' ')}
                        style={{ padding: '.5rem' }}
                      >
                        &lt;FddBtn
                        href=&quot;#&quot;&gt;人家是按鈕&lt;/FddBtn&gt;
                      </code>
                    </p>
                  </dd>
                  <dd>
                    <p>
                      <span>.btn-secondary</span>
                      <FaArrowRightLong />

                      <FddBtn color="info" outline callback={() => {}}>
                        人家是按鈕
                      </FddBtn>
                    </p>
                    <p>
                      <FaArrowRightLong />

                      <code
                        className={[hs.bgDark, hs.txSecondary].join(' ')}
                        style={{ padding: '.5rem' }}
                      >
                        &lt;FddBtn color=&quot;secondary&quot; outline
                        callback=&#123;()
                        =&gt;&#123;&#125;&#125;&gt;&lt;/FddBtn&gt;
                      </code>
                    </p>
                  </dd>
                  <dt>圓形按鈕</dt>
                  <dd>
                    <p>
                      <span>.btn-secondary</span>
                      <FaArrowRightLong />

                      <FddBtn color="error" icon callback={() => {}}>
                        <IoAddCircle />
                      </FddBtn>
                    </p>
                    <p>
                      <FaArrowRightLong />
                      <code
                        className={[hs.bgDark, hs.txSecondary].join(' ')}
                        style={{ padding: '.5rem' }}
                      >
                        &lt;FddBtn color=&quot;secondary&quot; icon
                        callback=&#123;()
                        =&gt;&#123;&#125;&#125;&gt;&lt;/FddBtn&gt;
                      </code>
                    </p>
                  </dd>
                </dl>
              </article>
              <article className="col12 col_lg6">
                <h2>
                  <a
                    href="https://react-icons.github.io/react-icons/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    React icons
                  </a>
                </h2>
                <dl>
                  <dt>小圖示的圖庫</dt>
                  <dd>其大小會繼承該層的 font-size</dd>
                  <dd>其顏色會繼承該層的 color</dd>
                  <dd>若要手動改變，需要透過此 API 設計的 context</dd>
                </dl>
              </article>
              <article className="col12 col_lg6">
                <h2 className={hs.h2}>常用連結</h2>
                <ul>
                  <li>
                    <span>小圖示庫：</span>
                    <a
                      href="https://react-icons.github.io/react-icons/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      React-icons
                    </a>
                  </li>
                  <li>
                    <span>專案 Figma：</span>
                    <a
                      href="https://www.figma.com/design/Q0KSE3JdYNKX3m1V2Hvnjf/fundodo-%E5%85%B1%E7%94%A8?node-id=93-69&t=E9X3RBeM4LSV4bUr-0"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      React-icons
                    </a>
                  </li>
                </ul>
              </article>
            </div>
          </section>
        </main>
      </IconContext.Provider>
    </>
  );
}
