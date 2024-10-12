import { useState, useEffect } from 'react'
import scss from '@/pages/article/commonItem/aside.module.scss'
import AsideArticle from './asideArticle'

export default function ArtiAside() {
  const [articles, setArticles] = useState([])
  const [randomArticles, setRandomArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const url = 'http://localhost:3005/api/article/articles'

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

  return (
    <aside className='d-flex flex-row flex-md-col gap-4'>
      <div>
        <h4 className={['bg-primary tx-default mb-4', scss.asideTitle].join(' ')}>最新文章</h4>
        {articles.slice(0, 5).map(arti => (
          <AsideArticle key={arti.id} article={arti} />
        ))}
      </div>
      <div>
        <h4
          className={['bg-info tx-default mb-4', scss.asideTitle].join(' ')}
        >
          熱門文章
        </h4>
        {randomArticles.map(arti => (
          <AsideArticle key={arti.id} article={arti} />
        ))}
      </div>
    </aside>
  );
}
