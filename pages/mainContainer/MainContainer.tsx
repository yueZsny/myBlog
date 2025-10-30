import './mainContainer.css';
import ArticleShow from '../../components/articleShow/articleShow';
import Menu from '../../components/menu/menu'; // 导入Menu组件
import { useState, useRef, useEffect } from 'react';

export default function MainContainer() {
  const [activeTab, setActiveTab] = useState('全部');
  const [showMenu, setShowMenu] = useState(false); // 控制菜单显示状态
  const sliderRef = useRef<HTMLDivElement>(null);
  const selectOptionsRef = useRef<HTMLDivElement>(null);

  const tabs = ['全部', 'HTML', 'CSS', 'JavaScript', 'React', 'Vue'];

  // 计算滑块位置
  const calculateSliderPosition = (tab: string) => {
    if (!sliderRef.current || !selectOptionsRef.current) return;

    const index = tabs.indexOf(tab);
    if (index === -1) return;

    const optionWidth = selectOptionsRef.current.offsetWidth / tabs.length;
    const sliderWidth = optionWidth - 10; // 减去边距

    sliderRef.current.style.width = `${sliderWidth}px`;
    sliderRef.current.style.left = `${index * optionWidth + 5}px`; // 加上左边距
  };

  // 处理鼠标移动事件
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!sliderRef.current || !selectOptionsRef.current) return;

    const rect = selectOptionsRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const optionWidth = rect.width / tabs.length;

    // 找到鼠标所在的选项索引
    const hoverIndex = Math.floor(mouseX / optionWidth);
    if (hoverIndex >= 0 && hoverIndex < tabs.length) {
      const sliderWidth = optionWidth - 10;
      sliderRef.current.style.width = `${sliderWidth}px`;
      sliderRef.current.style.left = `${hoverIndex * optionWidth + 5}px`;
    }
  };

  // 处理点击事件
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    calculateSliderPosition(tab);
  };

  // 处理菜单点击事件
  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  // 点击其他地方关闭菜单
  const handleClickOutside = () => {
    if (showMenu) {
      setShowMenu(false);
    }
  };

  // 初始化滑块位置
  useEffect(() => {
    // 将tabs数组也移到useEffect内部
    const tabs = ['全部', 'HTML', 'CSS', 'JavaScript', 'React', 'Vue'];

    const calculateSliderPosition = (tab: string) => {
      if (!sliderRef.current || !selectOptionsRef.current) return;

      const index = tabs.indexOf(tab);
      if (index === -1) return;

      const optionWidth = selectOptionsRef.current.offsetWidth / tabs.length;
      const sliderWidth = optionWidth - 10;

      sliderRef.current.style.width = `${sliderWidth}px`;
      sliderRef.current.style.left = `${index * optionWidth + 5}px`;
    };

    calculateSliderPosition(activeTab);

    const handleResize = () => {
      calculateSliderPosition(activeTab);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]); // 现在只需要activeTab依赖

  return (
    <>
      <div className='mainContainer' onClick={handleClickOutside}>
        {/* 菜单按钮 */}
        {/* <div className="menu" onClick={handleMenuClick}></div> */}
        {/* 菜单按钮 */}
        <div
          className="menu"
          onClick={(e) => {
            e.stopPropagation(); // 阻止事件冒泡
            handleMenuClick();
          }}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            width: '50px',
            height: '50px',
            backgroundColor: 'rgba(139, 241, 226, 0.8)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1000,
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#333'
          }}
        >
          菜单
        </div>

        {/* 菜单组件 - 显示在所有内容之上 */}
        {showMenu && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                minWidth: '300px',
                maxWidth: '80%',
                maxHeight: '80%',
                overflow: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Menu />
            </div>
          </div>
        )}
        <div className='titleMenu'>
          <div
            className="selectOptions"
            ref={selectOptionsRef}
            onMouseMove={(e) => handleMouseMove(e)} // 移除activeTab参数
            onMouseLeave={() => calculateSliderPosition(activeTab)}
          >
            {/* 滑块 */}
            <div className="slider" ref={sliderRef}></div>

            {/* 选项 */}
            {tabs.map((tab) => (
              <span
                key={tab}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => handleTabClick(tab)}
                onMouseEnter={() => {
                  if (sliderRef.current) {
                    const index = tabs.indexOf(tab);
                    const optionWidth = selectOptionsRef.current!.offsetWidth / tabs.length;
                    const sliderWidth = optionWidth - 10;
                    sliderRef.current.style.width = `${sliderWidth}px`;
                    sliderRef.current.style.left = `${index * optionWidth + 5}px`;
                  }
                }}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>
        <div className='mainContent'>
          <div className='mainLeft'>
            <div className="leftTitle">左边顶部 - 当前选择: {activeTab}</div>
            <div className="leftContent">
              {/* 文章展示组件 */}
              <ArticleShow />
              <ArticleShow />
              <ArticleShow />
            </div>
          </div>
          <div className='mainRight'>右边</div>
        </div>
      </div>
    </>
  );
}
