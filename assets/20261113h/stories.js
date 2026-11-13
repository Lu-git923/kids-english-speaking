/* 原创分级绘本文本（Level 1，5–8 词短句，重复句式，方便跟读）
 * 插图由 story.js 用 SVG 现画（原创矢量场景，零版权风险）
 * 坐标约定：y = 脚底/贴地线（室内地板 244，草地 244，公园小路 258）
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
  },
  {
    id: 'breakfast',
    title: 'Breakfast Time',
    titleZh: '早餐时间',
    level: 'Level 1 · 5–7 词',
    pages: [
      { bg: 'kitchen', props: [{ t: 'girl', x: 118, y: 244 }, { t: 'mum', x: 292, y: 244 }],
        en: 'It is morning.', zh: '早上啦。' },
      { bg: 'kitchen', props: [{ t: 'girl', x: 120, y: 244 }, { t: 'table', x: 280, y: 244 }],
        en: 'I want some milk.', zh: '我想喝牛奶。' },
      { bg: 'kitchen', props: [{ t: 'mum', x: 150, y: 244 }, { t: 'table', x: 292, y: 244 }],
        en: 'Here you are.', zh: '给你。' },
      { bg: 'kitchen', props: [{ t: 'girl', x: 120, y: 244, arm: 'up' }, { t: 'mum', x: 286, y: 244 }],
        en: 'Thank you, Mum.', zh: '谢谢妈妈。' },
      { bg: 'kitchen', props: [{ t: 'girl', x: 124, y: 244 }, { t: 'table', x: 278, y: 244 }],
        en: 'I want an egg, please.', zh: '我想要一个鸡蛋。' },
      { bg: 'kitchen', props: [{ t: 'girl', x: 128, y: 244, arm: 'up' }, { t: 'table', x: 276, y: 244 }],
        en: 'Yum, yum! I like it.', zh: '真好吃！我喜欢。' }
    ]
  },
  {
    id: 'at-the-park',
    title: 'At the Park',
    titleZh: '在公园',
    level: 'Level 1 · 4–6 词',
    pages: [
      { bg: 'park', props: [{ t: 'girl', x: 104, y: 258 }, { t: 'dad', x: 208, y: 258 }],
        en: 'We are at the park.', zh: '我们在公园里。' },
      { bg: 'park', props: [{ t: 'girl', x: 116, y: 258 }, { t: 'slide', x: 286, y: 258 }],
        en: 'Look at the slide.', zh: '看这个滑梯。' },
      { bg: 'park', props: [{ t: 'girl', x: 244, y: 258, arm: 'up' }, { t: 'slide', x: 286, y: 258 }],
        en: 'I can go up.', zh: '我能爬上去。' },
      { bg: 'park', props: [{ t: 'girl', x: 312, y: 258 }, { t: 'slide', x: 274, y: 258 }],
        en: 'I can go down.', zh: '我能滑下来。' },
      { bg: 'park', props: [{ t: 'girl', x: 160, y: 258, arm: 'up' }, { t: 'slide', x: 300, y: 258 }],
        en: 'That was fun!', zh: '真有趣！' },
      { bg: 'park', props: [{ t: 'girl', x: 240, y: 258 }, { t: 'slide', x: 292, y: 258 }],
        en: 'Again, please!', zh: '再来一次！' }
    ]
  },
  {
    id: 'new-shoes',
    title: 'My New Shoes',
    titleZh: '我的新鞋',
    level: 'Level 1 · 4–6 词',
    pages: [
      { bg: 'bedroom', props: [{ t: 'shoes', x: 148, y: 244 }, { t: 'girl', x: 264, y: 244 }],
        en: 'Look at my new shoes.', zh: '看我的新鞋。' },
      { bg: 'bedroom', props: [{ t: 'shoes', x: 200, y: 244 }, { t: 'girl', x: 300, y: 244 }],
        en: 'They are red and blue.', zh: '它们是红色和蓝色的。' },
      { bg: 'bedroom', props: [{ t: 'girl', x: 200, y: 244 }],
        en: 'I can put them on.', zh: '我能自己穿上。' },
      { bg: 'bedroom', props: [{ t: 'shoes', x: 140, y: 244 }, { t: 'girl', x: 250, y: 244 }],
        en: 'They are too big.', zh: '太大了。' },
      { bg: 'bedroom', props: [{ t: 'mum', x: 126, y: 244 }, { t: 'girl', x: 258, y: 244 }],
        en: 'Mum helps me.', zh: '妈妈帮我。' },
      { bg: 'bedroom', props: [{ t: 'shoes', x: 150, y: 244 }, { t: 'girl', x: 250, y: 244, arm: 'up' }],
        en: 'They fit now. Hooray!', zh: '现在正好！太棒了。' }
    ]
  },
  {
    id: 'cat-in-box',
    title: 'The Cat in the Box',
    titleZh: '箱子里的猫',
    level: 'Level 1 · 4–7 词',
    pages: [
      { bg: 'living', props: [{ t: 'box', x: 200, y: 244, s: 1.5 }],
        en: 'Look at the big box.', zh: '看这个大箱子。' },
      { bg: 'living', props: [{ t: 'girl', x: 110, y: 244 }, { t: 'box', x: 268, y: 244, s: 1.3 }],
        en: 'What is in the box?', zh: '箱子里有什么？' },
      { bg: 'living', props: [{ t: 'girl', x: 140, y: 244 }, { t: 'box', x: 276, y: 244, s: 1.3 }],
        en: 'I can hear a sound.', zh: '我听到一个声音。' },
      { bg: 'living', props: [{ t: 'cat', x: 262, y: 238, s: 1.2 }, { t: 'box', x: 276, y: 244, s: 1.3 }, { t: 'girl', x: 120, y: 244, arm: 'up' }],
        en: 'It is a cat!', zh: '是一只猫！' },
      { bg: 'living', props: [{ t: 'cat', x: 208, y: 236, s: 1.25 }, { t: 'box', x: 208, y: 244, s: 1.4 }],
        en: 'The cat likes the box.', zh: '猫喜欢这个箱子。' },
      { bg: 'living', props: [{ t: 'sofa', x: 290, y: 244 }, { t: 'cat', x: 152, y: 244, s: 1.3 }],
        en: 'Shh! It is sleeping.', zh: '嘘！它睡着了。' }
    ]
  },
  {
    id: 'rain-rain',
    title: 'Rain, Rain',
    titleZh: '下雨啦',
    level: 'Level 1 · 4–7 词',
    pages: [
      { bg: 'garden', rain: true, props: [{ t: 'girl', x: 150, y: 244 }],
        en: 'It is raining.', zh: '下雨了。' },
      { bg: 'garden', rain: true, props: [{ t: 'girl', x: 150, y: 244, arm: 'up' }],
        en: 'I want to go out.', zh: '我想出去玩。' },
      { bg: 'garden', rain: true, props: [{ t: 'girl', x: 132, y: 244 }],
        en: 'Where is my coat?', zh: '我的外套在哪里？' },
      { bg: 'garden', rain: true, props: [{ t: 'coat', x: 268, y: 244 }, { t: 'girl', x: 144, y: 244, arm: 'up' }],
        en: 'Here is my coat.', zh: '我的外套在这儿。' },
      { bg: 'garden', rain: true, props: [{ t: 'girl', x: 200, y: 244, arm: 'up' }],
        en: 'I can jump in the puddles.', zh: '我能在水坑里跳。' },
      { bg: 'garden', rain: true, props: [{ t: 'girl', x: 164, y: 244, arm: 'up' }, { t: 'dog', x: 286, y: 246, s: 0.9 }],
        en: 'I like the rain.', zh: '我喜欢下雨天。' }
    ]
  },
  {
    id: 'at-the-shop',
    title: 'At the Shop',
    titleZh: '在商店',
    level: 'Level 1 · 4–6 词',
    pages: [
      { bg: 'shop', props: [{ t: 'girl', x: 112, y: 244 }, { t: 'mum', x: 236, y: 244 }],
        en: 'We are at the shop.', zh: '我们在商店里。' },
      { bg: 'shop', props: [{ t: 'girl', x: 130, y: 244 }, { t: 'apple', x: 292, y: 244, s: 1.5 }],
        en: 'I want an apple.', zh: '我想要一个苹果。' },
      { bg: 'shop', props: [{ t: 'girl', x: 140, y: 244 }, { t: 'mum', x: 286, y: 244 }],
        en: 'How much is it?', zh: '这个多少钱？' },
      { bg: 'shop', props: [{ t: 'mum', x: 200, y: 244 }, { t: 'apple', x: 148, y: 244, s: 1.3 }],
        en: 'Here you are.', zh: '给你。' },
      { bg: 'shop', props: [{ t: 'girl', x: 148, y: 244, arm: 'up' }, { t: 'apple', x: 226, y: 244, s: 1.3 }],
        en: 'Thank you!', zh: '谢谢！' },
      { bg: 'shop', props: [{ t: 'girl', x: 132, y: 244 }, { t: 'mum', x: 252, y: 244 }],
        en: "Let's go home.", zh: '我们回家吧。' }
    ]
  }
];
