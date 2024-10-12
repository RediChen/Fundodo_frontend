import { apiBaseUrl } from '@/configs';
import { useRef, useEffect, useState } from 'react';
import AsideArticle from './asideArticle';
import scss from '@/pages/article/commonItem/asideRwd.module.scss';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io"

export default function ArtiAside() {
  const scrollArticleNew = useRef(null);
  const [articles, setArticles] = useState([])
  const [randomArticles, setRandomArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const url = `${apiBaseUrl}/article/articles`

      try {
        const response = await fetch(url)
        const data = await response.json()
        if (data.status === 'success') {
          setArticles(data.articles)
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchArticles()
  }, [])

  useEffect(() => {
    if (articles.length > 0) {
      const shuffled = [...articles].sort(() => 0.5 - Math.random());
      setRandomArticles(shuffled.slice(0, 5));
    }
  }, [articles]);
  const scrollRightNew = () => {
    if (scrollArticleNew.current) {
      scrollArticleNew.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  }
  const scrollLeftNew = () => {
    if (scrollArticleNew.current) {
      scrollArticleNew.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  }
  const scrollArticleHot = useRef(null);
  const scrollRightHot = () => {
    if (scrollArticleHot.current) {
      scrollArticleHot.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  }
  const scrollLeftHot = () => {
    if (scrollArticleHot.current) {
      scrollArticleHot.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  }
  return (
    <>
      <aside className={[scss.leftSide].join(' ')}>
        <div className={scss.asideContainer}>
          <section className={scss.asideSection}>
            <div className={scss.leftTitle}>最新文章</div>
            <button className={scss.backBtn} onClick={scrollRightNew}>
              <IoIosArrowBack />
            </button>
            <div className={scss.listWindow} ref={scrollArticleNew}>
              {articles.slice(0, 5).map(arti => (
                <AsideArticle key={arti.id} article={arti} />
              ))}
            </div>
            <button className={scss.moreBtn} onClick={scrollLeftNew}>
              <IoIosArrowForward />
            </button>
          </section>

          <section className={scss.asideSection}>
            <div className={scss.leftTitle} style={{ background: '#71C4EF' }}>熱門文章</div>
            <button className={scss.backBtn} onClick={scrollRightHot}>
              <IoIosArrowBack />
            </button>
            <div className={scss.listWindow} ref={scrollArticleHot}>
              {randomArticles.map(arti => (
                <AsideArticle key={arti.id} article={arti} />
              ))}
            </div>
            <button className={scss.moreBtn} onClick={scrollLeftHot}>
              <IoIosArrowForward />
            </button>
          </section>
        </div>
      </aside>
    </>
  );
}