/* 原创分级绘本文本（Level 1，5–8 词短句，重复句式，方便跟读）
 * 插图由 story.js 用 SVG 现画（原创矢量场景，零版权风险）
 * 坐标约定：y = 脚底/贴地线（室内地板 244，草地 244）
 */
window.STORIES = [
  {
    id: 'coco-ball',
    title: 'Coco and the Red Ball',
    titleZh: 'Coco 和红皮球',
    level: 'Level 1 · 5–8 词',
    pages: [
      { bg: 'garden', props: [{ t: 'girl', x: 120, y: 244 }, { t: 'dog', x: 268, y: 246, s: 0.95 }],
        en: 'Look at Coco.', zh: '看看 Coco。' },
      { bg: 'garden', props: [{ t: 'girl', x: 95, y: 244, arm: 'up' }, { t: 'dog', x: 250, y: 246, s: 0.95 }, { t: 'ball', x: 326, y: 234 }],
        en: 'Coco has a red ball.', zh: 'Coco 有一个红皮球。' },
      { bg: 'garden', props: [{ t: 'girl', x: 110, y: 244 }, { t: 'dog', x: 250, y: 246, s: 0.95, run: true }, { t: 'ball', x: 336, y: 234 }],
        en: 'The ball is red.', zh: '这个球是红色的。' },
      { bg: 'garden', props: [{ t: 'dog', x: 215, y: 246, s: 1.05, run: true }, { t: 'ball', x: 310, y: 234 }],
        en: 'Coco runs after the ball.', zh: 'Coco 追着球跑。' },
      { bg: 'garden', props: [{ t: 'girl', x: 120, y: 244, arm: 'up' }, { t: 'dog', x: 250, y: 246, s: 0.95, run: true }],
        en: 'Go, Coco, go!', zh: '加油，Coco，加油！' },
      { bg: 'garden', props: [{ t: 'tree', x: 300, y: 246 }, { t: 'ball', x: 300, y: 168, s: 0.9 }, { t: 'dog', x: 196, y: 246, s: 0.95 }, { t: 'girl', x: 92, y: 244 }],
        en: 'Oh no! The ball is in the tree.', zh: '哎呀！球跑到树上去了。' },
      { bg: 'garden', props: [{ t: 'tree', x: 306, y: 246 }, { t: 'ball', x: 306, y: 168, s: 0.9 }, { t: 'dad', x: 176, y: 246 }, { t: 'girl', x: 88, y: 244 }],
        en: 'Dad is here to help.', zh: '爸爸来帮忙了。' },
      { bg: 'garden', props: [{ t: 'tree', x: 320, y: 246 }, { t: 'girl', x: 108, y: 244, arm: 'up' }, { t: 'dad', x: 190, y: 246, arm: 'up' }, { t: 'dog', x: 262, y: 246, s: 0.9 }, { t: 'ball', x: 232, y: 214, s: 0.85 }],
        en: 'We can play again. Hooray!', zh: '又能一起玩啦。太棒了！' }
    ]
  },
  {
    id: 'bedtime',
    title: 'Time for Bed',
    titleZh: '该睡觉啦',
    level: 'Level 1 · 5–8 词',
    pages: [
      { bg: 'bedroom', props: [{ t: 'mum', x: 296, y: 244 }, { t: 'girl', x: 124, y: 244 }],
        en: 'It is time for bed.', zh: '该睡觉啦。' },
      { bg: 'bathroom', props: [{ t: 'girl', x: 200, y: 244, sit: true, arm: 'up' }, { t: 'tub', x: 200, y: 244 }],
        en: 'Mia has a bath.', zh: 'Mia 洗了个澡。' },
      { bg: 'bedroom', props: [{ t: 'girl', x: 200, y: 244, pj: true }],
        en: 'Mia puts on her pyjamas.', zh: 'Mia 换上睡衣。' },
      { bg: 'bedroom', props: [{ t: 'girl', x: 148, y: 244, pj: true, arm: 'up' }, { t: 'bed', x: 300, y: 244 }],
        en: 'Where is Teddy?', zh: '泰迪熊去哪儿了？' },
      { bg: 'bedroom', props: [{ t: 'teddy', x: 306, y: 244, s: 0.75 }, { t: 'bed', x: 236, y: 244 }],
        en: 'Teddy is under the bed.', zh: '泰迪熊在床底下。' },
      { bg: 'bedroom', props: [{ t: 'girl', x: 160, y: 244, pj: true }, { t: 'teddy', x: 228, y: 244, s: 0.85 }],
        en: 'Mia has Teddy.', zh: 'Mia 找到泰迪熊了。' },
      { bg: 'bedroom', props: [{ t: 'bed', x: 262, y: 244 }, { t: 'mum', x: 112, y: 244, arm: 'up' }],
        en: 'Mum reads a book.', zh: '妈妈读故事。' },
      { bg: 'bedroom', props: [{ t: 'teddy', x: 246, y: 214, s: 0.8 }, { t: 'bed', x: 220, y: 244 }],
        en: 'Good night, Mia.', zh: '晚安，Mia。' }
    ]
  }
];
