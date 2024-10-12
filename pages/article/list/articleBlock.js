import Image from 'next/image';
import Link from 'next/link';
import scss from '@/pages/article/list/articleBlock.module.scss';
import { FaRegEye } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";

export default function ArticleBlock({ article }) {
  const avatarSrc = article.avatar_file || '/userHead.png'
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }
  return (
    <>
      {' '}
      <div className={[scss.article].join('')}>
        <div>
          <div className={scss.userData}>
            <div className={scss.imageContainer}>
              <Image
                className={scss.userIcon}
                src={avatarSrc}
                alt=""
                fill
                sizes="40px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={scss.nicknameArea}>
              <p className={scss.nickName}>{article.author_nickname}</p>
              <p className={scss.creatTime}>{formatDate(article.create_at)}</p>
            </div>
          </div>
        </div>
        <div className={scss.shortContent}>
          <a className={scss.mainTitle} href={`/article/content?aid=${article.id}`}>
            {"【" + article.sort + "】" + article.title}
          </a>
          <div className={scss.extract}>
            <div dangerouslySetInnerHTML={{ __html: article.content.substring(0, 20) + '...' }} />
          </div>
        </div>
        <div className={scss.artiInfo}>
          <div className={scss.artiTags}>
            {article.tags && article.tags.map((tag, index) => (
              <Link key={index} href={`/article?tag=${encodeURIComponent(tag)}`}>
                <div className={scss.tag}>{tag}</div>
              </Link>
            ))}
          </div>
          <div className={scss.info}>
            <div className={scss.infoText}><FaRegEye />{article.view_count}</div>
            <div className={scss.infoText}><FiMessageSquare />{article.reply_count || 0}</div>
          </div>
        </div>
      </div>
    </>
  );
}
