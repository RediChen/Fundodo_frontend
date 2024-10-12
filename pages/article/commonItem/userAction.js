import { useState } from 'react'
import scss from '@/pages/article/commonItem/userAction.module.scss';
import Link from 'next/link';
import { IoIosSearch } from "react-icons/io";
import FddBtn from '@/components/buttons/fddBtn';

export default function UserAction({ onOrderByChange, currentOrderBy }) {
  const [search, setSearch] = useState('')

  const handleOrderByChange = (e) => {
    const newOrderBy = e.target.value
    onOrderByChange(newOrderBy)
  }
  return (
    <div className={scss.userAction}>
      <h4 className='d-none d-md-block'>home/討論區</h4>
      <div>
        <a className={scss.rwdCreate} href='/article/createArticle'>發表新文章</a>
      </div>
      <div className='d-flex flex-col flex-md-row gap-3'>
        <select
          className={scss.listSelect}
          value={currentOrderBy}
          onChange={handleOrderByChange}
        >
          <option value="1">最新文章 </option>
          <option value="2">留言最多</option>
        </select>
        <div className='d-flex flex-row ai-center gap-1'>
          <input
            type="text"
            placeholder='使用關鍵字搜尋'
            className={scss.searchBar}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <FddBtn
            color='primary'
            icon outline
            size='sm'
            style={{ borderWidth: '1px' }}
            href={`/article?search=${search}`}
          >
            <IoIosSearch />
          </FddBtn>
          {/* <Link className={scss.searchBtn} href={`/article?search=${search}`}><IoIosSearch /></Link> */}
        </div>
      </div>
    </div >
  )
}
