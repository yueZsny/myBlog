import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import './Home.css';

gsap.registerPlugin(Draggable, InertiaPlugin);

// 抽签结果类型
type FortuneResult = '大吉' | '中吉' | '小吉';

export default function Home() {
  const dragAreaRef = useRef<HTMLDivElement>(null);
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const fadeBoxRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const fortuneRef = useRef<HTMLDivElement>(null);

  const [fortuneResult, setFortuneResult] = useState<FortuneResult>('大吉');
  const [isRevealed, setIsRevealed] = useState(false);

  // 随机抽取签文
  const drawFortune = (): FortuneResult => {
    const results: FortuneResult[] = ['大吉', '中吉', '小吉'];
    const randomIndex = Math.floor(Math.random() * results.length);
    return results[randomIndex];
  };

  useEffect(() => {
    if (!dragAreaRef.current) return;

    // 文字拖拽逻辑 - 修复边界问题
    spanRefs.current.forEach((span) => {
      if (!span) return;

      // 计算精确的边界
      const calculateBounds = () => {
        if (!dragAreaRef.current) return {};

        const dragArea = dragAreaRef.current;
        const dragRect = dragArea.getBoundingClientRect();
        const spanRect = span.getBoundingClientRect();

        // 计算边界，考虑元素尺寸
        const leftBound = 0;
        const topBound = 0;
        const rightBound = dragRect.width - spanRect.width;
        const bottomBound = dragRect.height - spanRect.height;

        return {
          left: leftBound,
          top: topBound,
          right: rightBound,
          bottom: bottomBound
        };
      };

      Draggable.create(span, {
        type: "x,y",
        bounds: dragAreaRef.current,
        // 修复：加强边界控制
        edgeResistance: 0.95, // 大幅增加边界阻力
        throwResistance: 0.9, // 增加惯性阻力
        minimumMovement: 2,
        dragResistance: 0.3, // 增加拖拽阻力
        overshootTolerance: 0.1, // 大幅减小过冲容差

        // 优化惯性参数
        inertia: {
          resistance: 25, // 大幅增加惯性阻力
          minSpeed: 20,
          endSpeed: 3,
        },

        onPress: function() {
          gsap.to(span, {
            scale: 1.15,
            duration: 0.15,
            zIndex: 1000,
            ease: "power2.out"
          });
        },

        onRelease: function() {
          gsap.to(span, {
            scale: 1,
            duration: 0.25,
            zIndex: 1,
            ease: "back.out(1.5)"
          });
        },

        onDragStart: function() {
          // 拖拽开始时添加阴影效果
          gsap.to(span, {
            duration: 0.2,
            ease: "power2.out"
          });
        },

        onDragEnd: function() {
          // 拖拽结束时移除阴影
          gsap.to(span, {
            duration: 0.3,
            ease: "power2.out"
          });

          // 强制边界检查 - 确保元素不会超出边界
          const bounds = calculateBounds();
          const x = parseFloat(span.style.left) || 0;
          const y = parseFloat(span.style.top) || 0;

          // 边界检查 - 强制回到边界内
          const clampedX = Math.max(bounds.left, Math.min(x, bounds.right));
          const clampedY = Math.max(bounds.top, Math.min(y, bounds.bottom));

          if (x !== clampedX || y !== clampedY) {
            gsap.to(span, {
              x: clampedX,
              y: clampedY,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        },

        onDrag: function() {
          // 拖拽过程中添加轻微旋转效果
          const rotation = (this.deltaX + this.deltaY) * 0.3; // 减小旋转幅度
          gsap.to(span, {
            rotation: rotation,
            duration: 0.1,
            ease: "power1.out"
          });
        }
      });

      // 优化鼠标悬停效果
      span.addEventListener('mouseenter', () => {
        gsap.to(span, {
          duration: 0.15,
          ease: "power2.out"
        });
      });

      span.addEventListener('mouseleave', () => {
        gsap.to(span, {
          duration: 0.15,
          ease: "power2.out"
        });
      });
    });

    // 抽签盒子效果保持不变
    if (fadeBoxRef.current && coverRef.current && fortuneRef.current) {
      const fadeBox = fadeBoxRef.current;
      const cover = coverRef.current;
      const fortune = fortuneRef.current;

      // 鼠标进入效果
      fadeBox.addEventListener('mouseenter', () => {
        if (isRevealed) return;

        // 随机抽取签文
        const result = drawFortune();
        setFortuneResult(result);

        // 创建刮刮乐动画
        const tl = gsap.timeline();

        // 第一步：白板向右滑动消失
        tl.to(cover, {
          x: '100%',
          duration: 0.8,
          ease: "power2.out",
          onStart: () => {
            console.log("刮擦效果开始");
          }
        })
        // 第二步：签文淡入显示
        .to(fortune, {
          opacity: 1,
          scale: 1.1,
          duration: 0.5,
          ease: "back.out(1.7)",
          onComplete: () => {
            setIsRevealed(true);
          }
        }, "-=0.3")
        // 第三步：签文回弹效果
        .to(fortune, {
          scale: 1,
          duration: 0.3,
          ease: "elastic.out(1, 0.5)"
        });
      });

      // 鼠标离开效果（重置）
      fadeBox.addEventListener('mouseleave', () => {
        if (!isRevealed) return;

        const tl = gsap.timeline();

        // 第一步：签文淡出
        tl.to(fortune, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in"
        })
        // 第二步：白板滑回
        .to(cover, {
          x: '0%',
          duration: 0.6,
          ease: "power2.out"
        });
      });
    }

  }, [isRevealed]);

  const setSpanRef = (index: number) => (el: HTMLSpanElement | null) => {
    spanRefs.current[index] = el;
  };

  return (
    <div className="MainContainer">
      <div className="dragBox">
        <div ref={dragAreaRef} className='dragArea'>
          <span ref={setSpanRef(0)} className='drag'>你</span>
          <span ref={setSpanRef(1)} className='drag'>好</span>
          <span ref={setSpanRef(2)} className='drag'>,</span>
          <span ref={setSpanRef(3)} className='drag'>用户</span>
        </div>

        {/* 抽签盒子 */}
        <div ref={fadeBoxRef} className="fadeBox">
          <div ref={coverRef} className="fortuneCover">抽签盒子</div>
          <div ref={fortuneRef} className="fortuneResult">
            {fortuneResult}
          </div>
        </div>
      </div>
    </div>
  );
}
