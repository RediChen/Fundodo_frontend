import { useState, useEffect } from 'react';
import scss from '@/pages/article/editArticle.module.scss'
import axios from 'axios';
import Editor from './editor';
import Head from 'next/head';
import DefaultLayout from '@/components/layout/default';
import { useRouter } from 'next/router';

export default function EditArticle() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [sortOptions, setSortOptions] = useState([])
  const [selectedSort, setSelectedSort] = useState('0')
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { aid } = router.query

  useEffect(() => {
    if (aid) {
      setIsLoading(true);
      fetch(`http://localhost:3001/api/articleContent/${aid}`)
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            setTitle(data.content[0].title)
            setContent(data.content[0].content)
            setSelectedSort(data.content[0].sort_id.toString())
          }
        })
        .catch(error => console.error('Error fetching article:', error))
        .finally(() => setIsLoading(false));
    }
  }, [aid])

  useEffect(() => {
    fetch('http://localhost:3001/api/sort')
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setSortOptions(data.sorts)
        }
      })
      .catch(error => console.error('Error fetching sort options:', error));
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (selectedSort === '0') {
      alert('請選擇文章分類');
      return;
    }

    setIsLoading(true);

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const imageElements = doc.getElementsByTagName('img');
  
      const imageIds = Array.from(imageElements).map(img => {
        const src = img.getAttribute('src');
        const match = src.match(/articleImage-(\d+)-\d+\.[a-zA-Z0-9]+/);
        return match ? parseInt(match[1]) : null;
      }).filter(id => id !== null);
      
      const response = await axios.put(`http://localhost:3001/api/editArticle/${aid}`, { 
        title, 
        content, 
        sort: selectedSort, 
        imageIds 
      });
      
      console.log('Article updated:', response.data)
      alert('文章更新成功')
      router.push(`/article/content?aid=${aid}`)
    } catch (error) {
      console.error('Error updating article:', error)
      alert('更新文章時發生錯誤，請稍後再試。')
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async () => {
    if (window.confirm('確定要刪除這篇文章嗎？')) {
      setIsLoading(true);
      try {
        const response = await axios.delete(`http://localhost:3001/api/deleteArticle/${aid}`);
        console.log('Article deleted:', response.data);
        alert('文章已成功刪除')
        router.push('/article')
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('刪除文章時發生錯誤，請稍後再試。');
      } finally {
        setIsLoading(false);
      }
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>編輯文章</title>
        <meta name="description" content="Edit your article" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={scss.mainbg}>
        <div className={`container ${scss.creatForm}`}>
          <div className={scss.bread}>
            <h4>home/討論區/編輯文章</h4>
          </div>
          <form onSubmit={handleSubmit} className={` ${scss.formArea}`}>
            <input
              className={scss.artiTitle}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="文章標題"
              required
            />
            <select className={scss.artiSort} value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)} required>
              <option value="0">選擇分類</option>
              {sortOptions.map(sortitem => (
                <option key={sortitem.id} value={sortitem.id}>{sortitem.sort}</option>
              ))}
            </select>
            <Editor 
              content={content} 
              setContent={setContent} 
              editorHei="400px"
              onReady={() => setIsEditorReady(true)}
            />
            <div>
              <button 
                className={scss.postBtn} 
                type="submit" 
                disabled={!isEditorReady || isLoading}
              >
                {isLoading ? '更新中...' : '更新文章'}
              </button>
              <button 
              className={`${scss.postBtn} ${scss.deleteBtn}`} 
              type="button" 
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? '處理中...' : '刪除文章'}
            </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

EditArticle.layout = DefaultLayout;