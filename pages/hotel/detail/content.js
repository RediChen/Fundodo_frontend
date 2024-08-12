import React from 'react';
import styles from './content.module.scss';
import { BsQuestionCircle } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { FaBone } from "react-icons/fa6";
// import Icon from "./icon"

export default function Content() {
  return (
    <>
      <div className={styles.description}>
        <h3 className={styles.title}>旅館簡介</h3>
        <p className={styles.content}>
          D&amp;Y不僅提供寵物旅館服務，還有協助狗狗中途，尤其在旅館住宿方面，老闆堅持提供毛小孩24小時專業照顧，確保狗狗身旁有寵物保姆，而且會隨時記錄、主動告知飼主毛小孩狀況，飼主也能透過手機視訊查看自己寶貝的現況，環境相當令人安心。
          D&amp;Y不僅提供寵物旅館服務，還有協助狗狗中途，尤其在旅館住宿方面，老闆堅持提供毛小孩24小時專業照顧，確保狗狗身旁有寵物保姆，而且會隨時記錄、主動告知飼主毛小孩狀況，飼主也能透過手機視訊查看自己寶貝的現況，環境相當令人安心。
        </p>
      </div>

      <div className={styles.service}>
        <h3 className={styles.title}>設施與服務</h3>
        <ul>
          <li>
            <img src="./icon/OBJECTS.svg" alt="Icon" />
            室內活動區
          </li>
          <li>
            <img src="./icon/OBJECTS-2.svg" alt="Icon" />
            提供飼料鮮食
          </li>
          <li>
            <img src="./icon/OBJECTS-3.svg" alt="Icon" />
            24小時家長網路遠端監控
          </li>
          <li>
            <img src="./icon/OBJECTS-4.svg" alt="Icon" />
            寵物洗澡服務
          </li>
        </ul>
      </div>

      <div className={styles.faqSection}>
        <h3 className={styles.title}>常見問題</h3>
        <div className={styles.faqQuestion}>
          <div className={styles.leftContent}>
            <span className={styles.faqIcon}><BsQuestionCircle /></span>
            行前需要做哪些準備？
          </div>
          <span className={styles.faqIcon}><IoIosArrowDown /></span>
        </div>
        <div className={styles.faqAnswer}>
          <ul>
            <li>
              <FaBone className={styles.boneIcon} />
              寵物疫苗手冊正本
            </li>
            <li>
              <FaBone className={styles.boneIcon} />
              寵物熟悉的物品（例：玩具、食品、尿布墊、貓砂等）
            </li>
            <li>
              <FaBone className={styles.boneIcon} />
              主人可攜帶一件自己的衣物給毛寶貝增加安全感
            </li>
            <li>
              <FaBone className={styles.boneIcon} />
              若需服用藥物、擦藥、保健品，請主人自備
            </li>
            <li>
              <FaBone className={styles.boneIcon} />
              主人可攜帶毛寶貝日常吃的飼料或罐頭等，以防敏感毛寶貝不吃飯或不適應而拉肚子等情況
            </li>
            <li>
              <FaBone className={styles.boneIcon} />
              主人若自備餵食請按一餐份密封裝妥
            </li>
            <li>
              <FaBone className={styles.boneIcon} />
              若需額外加溫過狗窩請自備牽繩
            </li>
            <li>
              <FaBone className={styles.boneIcon} />
              若狗狗不會使用尿盆請自備個人尿布片
            </li>
          </ul>
        </div>

        <div className={styles.faqQuestion}>
          <div className={styles.leftContent}>
            <span className={styles.faqIcon}><BsQuestionCircle /></span>
            每次辦理入住應提供？
          </div>
          <span className={styles.faqIcon}><IoIosArrowDown /></span>
        </div>
        <div className={styles.faqAnswer}>
          <ul>
            <li><FaBone className={styles.boneIcon} />7歲以下狗狗：入館日期一年內已施打『狂犬病疫苗』、多合一疫苗</li>
            <li><FaBone className={styles.boneIcon} />7歲以上狗狗：入館日期二年內已施打『狂犬病疫苗』、多合一疫苗</li>
            <li><FaBone className={styles.boneIcon} />貓貓：入館日期二年內已施打『狂犬病疫苗』、多合一疫苗</li>
            <li><FaBone className={styles.boneIcon} />
              狗／貓：一個月內使用過體內／體外驅蟲預防藥需出示手冊獸醫院蓋章證明
            </li>
          </ul>
        </div>
        <div className={styles.faqQuestion}>
          <div className={styles.leftContent}>
            <span className={styles.faqIcon}><BsQuestionCircle /></span>
            狗狗住宿要自備飼料嗎?
          </div>
          <span className={styles.faqIcon}><IoIosArrowDown /></span>
        </div>
        <div className={styles.faqAnswer}>
          <ul>
            <li><FaBone className={styles.boneIcon} />
              依照狗狗平時在家習慣準備相關物品，牽繩，碗，床類用品，玩具，零食等等~為了避免產生食物過敏，拉肚子。
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;請家長務必要自備的其中一項為狗狗習慣吃的飼料或鮮食（本店有冰箱可保存）。
            </li>
          </ul>
        </div>
        <div className={styles.faqQuestion}>
          <div className={styles.leftContent}>
            <span className={styles.faqIcon}><BsQuestionCircle /></span>
            要自備寶貝習慣的用品嗎
          </div>
          <span className={styles.faqIcon}><IoIosArrowDown /></span>
        </div>
        <div className={styles.faqAnswer}>
          <ul>
            <li><FaBone className={styles.boneIcon} />寵物的食物和零食</li>
            <li><FaBone className={styles.boneIcon} />日常使用的碗具</li>
            <li><FaBone className={styles.boneIcon} />喜愛的玩具或安撫物</li>
            <li><FaBone className={styles.boneIcon} />專用的床墊或睡窩</li>
            <li><FaBone className={styles.boneIcon} />牽繩和項圈</li>
            <li><FaBone className={styles.boneIcon} />必要的藥物</li>
            <li><FaBone className={styles.boneIcon} />
              自備熟悉的物品可以幫助寵物適應新環境，減少焦慮。需要攜帶的物品可能因旅館政策而異，建議在預訂時詢問工作人員具體要求。
            </li>
          </ul>
        </div>
      </div>

    </>
  );
}