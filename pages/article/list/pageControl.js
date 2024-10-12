import scss from '@/pages/article/list/pageControl.module.scss';
import Link from 'next/link';

export default function PageControl() {
  const toTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  // const toFirstPage = () => {
  //   router.push('/article');
  // }

  return (
    <>
      <div className={[scss.pageCtrl].join()}>
        <div className={[scss.ctrler].join()}>
          <Link className={[scss.ctrlText].join()} href='/article/createArticle'>發表新文章</Link>
        </div>
        <div className={[scss.ctrler].join()}>
          <a className={[scss.ctrlText].join()} onClick={() => toTop()}>回到頂端</a>
        </div>
        {/* <div className={[scss.ctrler].join()}>
          <a className={[scss.ctrlText].join()} onClick={()=>toFirstPage()}>到第一頁</a>
        </div> */}
      </div>
    </>
  );
}
