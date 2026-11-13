/* 主题绘本第二弹：日常高频（5 本）+ 情绪 + 食物味道 + Level 2 进阶（2 本）
 * 原创内容，Level 1 / Level 2
 */
window.STORIES3 = [
  /* ---------- 日常高频 ---------- */
  {
    id: 'time-to-wash',
    title: 'Time to Wash',
    titleZh: '该洗漱啦',
    level: 'Level 1 · 日常·洗漱',
    pages: [
      { bg: 'bathroom', props: [{ t: 'girl', x: 130, y: 244 }, { t: 'mum', x: 300, y: 244 }],
        en: 'It is time to wash.', zh: '该洗漱啦。' },
      { bg: 'bathroom', props: [{ t: 'sink', x: 250, y: 244 }, { t: 'girl', x: 132, y: 244, arm: 'up' }],
        en: 'I wash my hands.', zh: '我洗手。' },
      { bg: 'bathroom', props: [{ t: 'sink', x: 250, y: 244 }, { t: 'girl', x: 132, y: 244 }],
        en: 'I brush my teeth.', zh: '我刷牙。' },
      { bg: 'bathroom', props: [{ t: 'sink', x: 240, y: 244 }, { t: 'girl', x: 140, y: 244, arm: 'up' }],
        en: 'I wash my face.', zh: '我洗脸。' },
      { bg: 'bathroom', props: [{ t: 'girl', x: 200, y: 244, face: 'happy' }],
        en: 'I look in the mirror.', zh: '我照镜子。' },
      { bg: 'bathroom', props: [{ t: 'girl', x: 190, y: 244, face: 'happy', arm: 'up' }],
        en: 'All clean!', zh: '干干净净！' }
    ]
  },
  {
    id: 'get-dressed',
    title: 'Get Dressed',
    titleZh: '穿衣服',
    level: 'Level 1 · 日常·穿衣',
    pages: [
      { bg: 'bedroom', props: [{ t: 'girl', x: 130, y: 244 }, { t: 'shirt', x: 270, y: 244 }],
        en: 'It is time to get dressed.', zh: '该穿衣服啦。' },
      { bg: 'bedroom', props: [{ t: 'shirt', x: 130, y: 244 }, { t: 'girl', x: 260, y: 244, arm: 'up' }],
        en: 'I put on my shirt.', zh: '我穿上衬衫。' },
      { bg: 'bedroom', props: [{ t: 'girl', x: 200, y: 244 }],
        en: 'I put on my trousers.', zh: '我穿上裤子。' },
      { bg: 'bedroom', props: [{ t: 'shoes', x: 140, y: 244 }, { t: 'girl', x: 270, y: 244 }],
        en: 'I put on my shoes.', zh: '我穿上鞋子。' },
      { bg: 'bedroom', props: [{ t: 'girl', x: 200, y: 244, arm: 'up' }],
        en: 'I can do it myself!', zh: '我自己会穿！' },
      { bg: 'bedroom', props: [{ t: 'girl', x: 180, y: 244, face: 'happy', arm: 'up' }],
        en: 'I am ready to go.', zh: '我准备好出门啦。' }
    ]
  },
  {
    id: 'time-to-eat',
    title: 'Time to Eat',
    titleZh: '吃饭啦',
    level: 'Level 1 · 日常·吃饭',
    pages: [
      { bg: 'kitchen', props: [{ t: 'table', x: 250, y: 244 }, { t: 'girl', x: 120, y: 244 }],
        en: 'It is time to eat.', zh: '该吃饭啦。' },
      { bg: 'kitchen', props: [{ t: 'table', x: 200, y: 244 }, { t: 'girl', x: 320, y: 244 }],
        en: 'I sit at the table.', zh: '我坐在桌边。' },
      { bg: 'kitchen', props: [{ t: 'table', x: 240, y: 244 }, { t: 'girl', x: 124, y: 244 }],
        en: 'I eat my rice.', zh: '我吃饭。' },
      { bg: 'kitchen', props: [{ t: 'milk', x: 190, y: 244, s: 1.3 }, { t: 'girl', x: 300, y: 244 }],
        en: 'I drink my milk.', zh: '我喝牛奶。' },
      { bg: 'kitchen', props: [{ t: 'girl', x: 200, y: 244 }],
        en: 'I wipe my mouth.', zh: '我擦擦嘴。' },
      { bg: 'kitchen', props: [{ t: 'girl', x: 190, y: 244, face: 'happy', arm: 'up' }],
        en: 'I am full. Thank you!', zh: '我吃饱了，谢谢！' }
    ]
  },
  {
    id: 'the-toilet',
    title: 'I Need the Toilet',
    titleZh: '我要上厕所',
    level: 'Level 1 · 日常·如厕',
    pages: [
      { bg: 'bathroom', props: [{ t: 'girl', x: 190, y: 244 }],
        en: 'I need the toilet.', zh: '我要上厕所。' },
      { bg: 'bathroom', props: [{ t: 'toilet', x: 260, y: 244 }, { t: 'girl', x: 130, y: 244 }],
        en: 'Here is the toilet.', zh: '厕所在这儿。' },
      { bg: 'bathroom', props: [{ t: 'girl', x: 200, y: 244 }],
        en: 'I can do it myself.', zh: '我自己可以。' },
      { bg: 'bathroom', props: [{ t: 'sink', x: 250, y: 244 }, { t: 'girl', x: 130, y: 244, arm: 'up' }],
        en: 'I wash my hands.', zh: '我洗手。' },
      { bg: 'bathroom', props: [{ t: 'girl', x: 190, y: 244 }],
        en: 'I dry my hands.', zh: '我擦干手。' },
      { bg: 'bathroom', props: [{ t: 'girl', x: 190, y: 244, face: 'happy', arm: 'up' }],
        en: 'All done!', zh: '好啦！' }
    ]
  },
  {
    id: 'tidy-up',
    title: 'Tidy Up',
    titleZh: '收拾玩具',
    level: 'Level 1 · 日常·收拾',
    pages: [
      { bg: 'living', props: [{ t: 'ball', x: 130, y: 236 }, { t: 'blocks', x: 230, y: 244 }, { t: 'girl', x: 320, y: 244 }],
        en: 'What a mess!', zh: '好乱呀！' },
      { bg: 'living', props: [{ t: 'girl', x: 130, y: 244 }, { t: 'ball', x: 250, y: 236 }, { t: 'blocks', x: 316, y: 244 }],
        en: 'The toys are on the floor.', zh: '玩具都在地上。' },
      { bg: 'living', props: [{ t: 'box', x: 260, y: 244, s: 1.3 }, { t: 'girl', x: 130, y: 244, arm: 'up' }],
        en: "Let's put them in the box.", zh: '我们把它们放进箱子。' },
      { bg: 'living', props: [{ t: 'box', x: 250, y: 244, s: 1.3 }, { t: 'blocks', x: 160, y: 244 }, { t: 'girl', x: 96, y: 244 }],
        en: 'The blocks go in.', zh: '积木放进去。' },
      { bg: 'living', props: [{ t: 'box', x: 250, y: 244, s: 1.3 }, { t: 'ball', x: 160, y: 236 }, { t: 'girl', x: 96, y: 244 }],
        en: 'The ball goes in.', zh: '皮球放进去。' },
      { bg: 'living', props: [{ t: 'box', x: 280, y: 244, s: 1.3 }, { t: 'girl', x: 150, y: 244, face: 'happy', arm: 'up' }],
        en: 'Now it is tidy!', zh: '现在整洁啦！' }
    ]
  },

  /* ---------- 情绪 ---------- */
  {
    id: 'how-do-you-feel',
    title: 'How Do You Feel?',
    titleZh: '你感觉怎么样',
    level: 'Level 1 · 情绪',
    pages: [
      { bg: 'living', props: [{ t: 'girl', x: 190, y: 244, face: 'happy', arm: 'up' }],
        en: 'I am happy today.', zh: '我今天很开心。' },
      { bg: 'living', props: [{ t: 'girl', x: 190, y: 244, face: 'sad' }],
        en: 'Now I am sad.', zh: '现在我有点难过。' },
      { bg: 'living', props: [{ t: 'girl', x: 190, y: 244, face: 'angry' }],
        en: 'I am angry!', zh: '我生气了！' },
      { bg: 'bedroom', props: [{ t: 'girl', x: 190, y: 244, face: 'tired', pj: true }],
        en: 'I am tired.', zh: '我累了。' },
      { bg: 'bedroom', props: [{ t: 'girl', x: 190, y: 244, face: 'scared', pj: true }, { t: 'teddy', x: 280, y: 244, s: 0.8 }],
        en: 'I am scared of the dark.', zh: '我怕黑。' },
      { bg: 'bedroom', props: [{ t: 'girl', x: 170, y: 244, face: 'happy', pj: true, arm: 'up' }, { t: 'teddy', x: 246, y: 244, s: 0.85 }],
        en: 'Mum helps me. I am happy.', zh: '妈妈来陪我，我又开心了。' }
    ]
  },

  /* ---------- 食物 & 味道 ---------- */
  {
    id: 'yummy-food',
    title: 'Yummy Food',
    titleZh: '好吃的食物',
    level: 'Level 1 · 食物·味道',
    pages: [
      { bg: 'kitchen', props: [{ t: 'table', x: 200, y: 244 }, { t: 'apple', x: 130, y: 244, s: 1.3 }],
        en: 'Look at the food.', zh: '看这些食物。' },
      { bg: 'kitchen', props: [{ t: 'apple', x: 200, y: 244, s: 1.8 }],
        en: 'The apple is sweet.', zh: '苹果是甜的。' },
      { bg: 'kitchen', props: [{ t: 'banana', x: 200, y: 244, s: 1.8 }],
        en: 'The banana is sweet too.', zh: '香蕉也是甜的。' },
      { bg: 'kitchen', props: [{ t: 'cake', x: 200, y: 244, s: 1.8 }],
        en: 'The cake is very sweet.', zh: '蛋糕非常甜。' },
      { bg: 'kitchen', props: [{ t: 'star', x: 160, y: 200, s: 1.4 }, { t: 'girl', x: 280, y: 244, face: 'scared' }],
        en: 'Sour! My face is funny.', zh: '好酸！我的表情好奇怪。' },
      { bg: 'kitchen', props: [{ t: 'table', x: 200, y: 244 }, { t: 'girl', x: 96, y: 244 }],
        en: 'The soup is hot!', zh: '汤好烫！' },
      { bg: 'kitchen', props: [{ t: 'girl', x: 180, y: 244, face: 'happy', arm: 'up' }, { t: 'cake', x: 292, y: 244, s: 1.2 }],
        en: 'I like sweet food best.', zh: '我最喜欢甜的东西。' }
    ]
  },

  /* ---------- Level 2 进阶 ---------- */
  {
    id: 'busy-morning',
    title: 'A Busy Morning',
    titleZh: '忙碌的早上',
    level: 'Level 2 · and / but / because',
    pages: [
      { bg: 'bathroom', props: [{ t: 'girl', x: 140, y: 244 }, { t: 'sink', x: 270, y: 244 }],
        en: 'I get up and I wash my face.', zh: '我起床，然后洗脸。' },
      { bg: 'bedroom', props: [{ t: 'girl', x: 150, y: 244 }, { t: 'shirt', x: 270, y: 244 }],
        en: 'I put on my shirt and my shoes.', zh: '我穿上衬衫和鞋子。' },
      { bg: 'garden', rain: true, props: [{ t: 'girl', x: 180, y: 244 }],
        en: 'I want to go out, but it is raining.', zh: '我想出去玩，但是下雨了。' },
      { bg: 'bedroom', props: [{ t: 'coat', x: 260, y: 244 }, { t: 'girl', x: 140, y: 244 }],
        en: 'I take my coat because it is cold.', zh: '我拿上外套，因为天冷。' },
      { bg: 'garden', props: [{ t: 'girl', x: 110, y: 244, arm: 'up' }, { t: 'dog', x: 260, y: 246, s: 0.95, run: true }],
        en: 'I run to the park and I see Coco.', zh: '我跑到公园，看见了 Coco。' },
      { bg: 'garden', props: [{ t: 'girl', x: 140, y: 244, face: 'happy', arm: 'up' }, { t: 'dog', x: 250, y: 246, s: 0.95 }],
        en: 'We play and we are happy.', zh: '我们一起玩，很开心。' }
    ]
  },
  {
    id: 'the-big-hill',
    title: 'Up the Hill',
    titleZh: '爬上小山',
    level: 'Level 2 · and / but / because',
    pages: [
      { bg: 'sky', props: [{ t: 'girl', x: 140, y: 246 }, { t: 'dog', x: 260, y: 248, s: 0.9 }],
        en: 'I want to play, but it is hot.', zh: '我想玩，但是天很热。' },
      { bg: 'sky', props: [{ t: 'milk', x: 190, y: 246, s: 1.4 }, { t: 'girl', x: 300, y: 246 }],
        en: 'I drink water because I am thirsty.', zh: '我喝水，因为我渴了。' },
      { bg: 'sky', props: [{ t: 'girl', x: 130, y: 246 }, { t: 'dog', x: 260, y: 248, s: 0.95, run: true }],
        en: 'Coco runs and I run too.', zh: 'Coco 跑，我也跑。' },
      { bg: 'sky', props: [{ t: 'girl', x: 180, y: 246, face: 'tired' }],
        en: 'I am tired, but I am happy.', zh: '我累了，但是很开心。' },
      { bg: 'garden', props: [{ t: 'tree', x: 280, y: 246 }, { t: 'girl', x: 150, y: 244 }, { t: 'dog', x: 210, y: 246, s: 0.9 }],
        en: 'We sit under the tree because it is cool.', zh: '我们坐在树下，因为那里很凉快。' },
      { bg: 'sky', props: [{ t: 'girl', x: 150, y: 246, face: 'happy', arm: 'up' }, { t: 'sun', x: 300, y: 100, s: 1.1 }],
        en: 'Next time we will come again.', zh: '下次我们还会再来。' }
    ]
  }
];
