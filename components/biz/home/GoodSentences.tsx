"use client";
import { useMemoizedFn } from 'ahooks';
import { memo, useEffect, useState } from 'react';

const sentences = [
  '以高估值买新兴行业而落入成长陷阱的是沉迷于“未得到”，以低估值买入夕阳行业而落入价值陷阱的是沉迷于“已失去”。投资中风险收益比最高的还是那些容易被低估的“正拥有”',
  '成长陷阱：估值过高；技术路径踏空；无利润增长；成长性破产；盲目多元化；树大招风（门槛）；新产品风险；寄生式增长；高成长不可持续；会计造假',
  '价值陷阱：技术被淘汰；存在赢家通吃的小公司；行业分散的重资产夕阳企业；景气顶点的周期股；会计欺诈；管理能力差',
  '已经暴露的风险其危险性已经反应在价格里（Price In）了，此时的风险会带来相应的高回报；而隐藏的风险不具备此特性',
  '逻辑性强的策略报告一般没用，因为市场经常不讲逻辑',
  '成功的策略需要对市场短期的反逻辑性的非理性行为有充分的考量',
  '分析股价波动的原因：基本面？政策面？情绪面？',
  '方法流行之时，也正是失去效力的时候',
  '先发优势企业往往有很大的资本投入，自由现金流很差，但其规模优势、成本优势和渠道优势会在扩张中快速建立',
  '针对每一个财报数字，都要审慎地问：这个数字背后的含义是什么？可能的衡量误差有点多大？什么人会在什么时候造假扭曲',
  '高层次的思考，是了解各种财务数字产生的原因，预测它们未来的发展趋势，并清楚企业在整个经济体系中的作用',
  '盈余的高品质特点：持续、可预测、稳定、可变现、低造假可能',
];

interface GoodSentencesProps {
  /** 0 - 1 的随机数 */
  seed: number;
}

export const GoodSentences = memo<GoodSentencesProps>((props) => {
  const { seed } = props;
  const normalSeed = (seed > 1 || seed < 0) ? 0 : seed;
  const [index, setIndex] = useState(Math.floor(normalSeed * sentences.length));

  const onClick = useMemoizedFn(() => {
    const next = (index + 1) % sentences.length;
    setIndex(next);
  });

  useEffect(
    () => {
      const keyDownHandler = (e: KeyboardEvent) => {
        if (e.key === ' ') {
          e.preventDefault()
          onClick();
        }
      };

      document.addEventListener('keydown', keyDownHandler);

      return () => {
        document.removeEventListener('keydown', keyDownHandler);
      };
    },
    [onClick],
  );

  return (
    <div
      className="w-full lg:w-[800px] text-lg lg:text-xl text-muted-foreground hover:text-zinc-400/80 active:text-zinc-400/60 text-start lg:text-center cursor-default"
      onClick={onClick}
    >
      {sentences[index]}
    </div>
  );
});

GoodSentences.displayName = 'GoodSentences';

