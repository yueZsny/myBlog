import './articleShow.css';

export default function ArticleShow() {
  return (
    <div className="articleShow">
      <div className="articleLeft">
        <span className="articleTitle">布局样式</span>
        <span className="articleMsg">关于布局首先是。。。。。。。。</span>
      </div>
      <div className="articleRight">
        {/* <div className="author"></div> */}
        <div className="createTime">2025/10/18</div>
        <div className="hotMsg">1100</div>
      </div>
    </div>
  )
}
