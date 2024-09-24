import Head from 'next/head';
import FddBtn from '@/components/buttons/fddBtn.js';
import DefaultLayout from '@/components/layout/default'
import { useState } from 'react'
import { FaUpRightFromSquare } from "react-icons/fa6";
import { IconContext } from 'react-icons';
import Modal from '@/components/common/modal';

export default function galleryModal() {
  /**
   * @type {boolean[]} Whether modal is active
   */
  const initState = Array(5).fill(false);
  const [modalState, setModalState] = useState(initState);
  const gene = index => {
    const arr = [false, false, false, false, false];
    arr[index] = true;
    return arr;
  }
  return (
    <>
      <Head>
        <title>Modal 圖鑑 | 翻肚肚元件</title>
      </Head>
      <div className="container">
        <div className="row jc-center">
          <div className="col-12 col-lg-6 py-3 my-5">
            <h2 className='tx-center'>彈出式視窗</h2>
            <h5 className='tx-center'>點擊下列按鈕以啟動 modal</h5>
            <p className='tx-center'>詳細語法請參考本 js 檔</p>
          </div>
          <div className="col-12 col-lg-8 py-3 mb-5">
            <div className="row row-cols-2 row-cols-lg-3">
              <div className="col">
                <FddBtn color="primary" outline icon callback={() => setModalState(gene(0))}>
                  <IconContext.Provider value={{ size: '2.5rem' }}>
                    <FaUpRightFromSquare />
                  </IconContext.Provider>
                </FddBtn>
                <p>mode = 1, style = 1</p>
              </div>
              <div className="col">
                <FddBtn color="primary" outline icon callback={() => setModalState(gene(1))}>
                  <IconContext.Provider value={{ size: '2.5rem' }}>
                    <FaUpRightFromSquare />
                  </IconContext.Provider>
                </FddBtn>
                <p>mode = 1, style = 2</p>
              </div>
              <div className="col">
                <FddBtn color="primary" outline icon callback={() => setModalState(gene(2))}>
                  <IconContext.Provider value={{ size: '2.5rem' }}>
                    <FaUpRightFromSquare />
                  </IconContext.Provider>
                </FddBtn>
                <p>mode = 1, style = 3</p>
              </div>
              <div className="col">
                <FddBtn color="primary" outline icon callback={() => setModalState(gene(3))}>
                  <IconContext.Provider value={{ size: '2.5rem' }}>
                    <FaUpRightFromSquare />
                  </IconContext.Provider>
                </FddBtn>
                <p>mode = 2, style = 1</p>
              </div>
            </div>


          </div>
        </div>
      </div>
      <Modal
        mode={1}
        active={modalState[0]}
        onClose={() => setModalState(initState)}
      >
        <h1>確認成功！</h1>
        <span>拉不拉多拉不拉多拉布拉布拉布拉布拉布拉布拉布拉不拉多拉布拉布拉布拉布拉布拉布拉不拉多拉布拉布拉布拉布拉布拉不拉多拉布拉布拉布拉布拉不拉多拉布拉布拉布拉</span>
      </Modal>
      <Modal
        mode={1}
        style={2}
        active={modalState[1]}
        onClose={() => setModalState(initState)}
      >
        <h1>確認失敗！</h1>
        <span>拉不拉多拉不拉多拉布拉布拉布拉布拉布拉布拉布拉不拉多拉布拉布拉布拉布拉布拉布拉不拉多拉布拉布拉布拉布拉布拉不拉多拉布拉布拉布拉布拉不拉多拉布拉布拉布拉</span>
      </Modal>
      <Modal
        mode={1}
        style={3}
        active={modalState[2]}
        onClose={() => setModalState(initState)}
      >
        <h1>確認成功！</h1>
        <span>拉不拉多拉不拉多拉布拉布拉布拉布拉布拉布拉布拉不拉多拉布拉布拉布拉布拉布拉布拉不拉多拉布拉布拉布拉布拉布拉不拉多拉布拉布拉布拉布拉不拉多拉布拉布拉布拉</span>
      </Modal>
      <Modal
        mode={2}
        active={modalState[3]}
        onClose={() => setModalState(initState)}
        confirmText='確定'
        cancelText='算了'
      >
        <h1>你確定這樣的行為是正確的嗎？</h1>
        <p>拉不拉多拉不拉多拉布拉布拉布拉布拉布拉布拉布拉不拉多拉布拉布拉布拉布拉布拉布拉不拉多拉布拉布拉布拉布拉布拉不拉多拉布拉布拉布拉布拉不拉多拉布拉布拉布拉</p>
      </Modal>
    </>
  )
}

galleryModal.layout = DefaultLayout;
