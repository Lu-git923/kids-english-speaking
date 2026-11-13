/* 主题绘本（颜色 / 数字 / 动物 / 身体部位 / 天气）—— 原创，Level 1
 * 由 story.js 合并进 STORIES 列表
 */
window.STORIES2 = [
  {
    id: 'colours',
    title: 'What Colour?',
    titleZh: '什么颜色',
    level: 'Level 1 · 颜色',
    pages: [
      { bg: 'sky', props: [
          { t: 'balloon', x: 108, y: 250, color: '#ef5350' },
          { t: 'balloon', x: 200, y: 250, color: '#4a90d9' },
          { t: 'balloon', x: 292, y: 250, color: '#ffd84d' }],
        en: 'Look at the balloons.', zh: '看这些气球。' },
      { bg: 'sky', props: [{ t: 'balloon', x: 138, y: 252, color: '#ef5350', s: 1.45 }, { t: 'girl', x: 300, y: 246 }],
        en: 'The red balloon is big.', zh: '红色的气球很大。' },
      { bg: 'sky', props: [{ t: 'balloon', x: 150, y: 250, color: '#4a90d9', s: 0.75 }, { t: 'girl', x: 276, y: 246 }],
        en: 'The blue balloon is small.', zh: '蓝色的气球很小。' },
      { bg: 'sky', props: [{ t: 'balloon', x: 210, y: 252, color: '#ffd84d', s: 1.2 }, { t: 'girl', x: 110, y: 246, arm: 'up' }],
        en: 'I like the yellow one.', zh: '我喜欢黄色的那个。' },
      { bg: 'sky', props: [
          { t: 'balloon', x: 120, y: 250, color: '#ef5350' },
          { t: 'balloon', x: 210, y: 250, color: '#4a90d9' },
          { t: 'balloon', x: 300, y: 250, color: '#ffd84d' }],
        en: 'Red, blue and yellow.', zh: '红色、蓝色和黄色。' },
      { bg: 'sky', props: [{ t: 'girl', x: 140, y: 246, arm: 'up' }, { t: 'balloon', x: 300, y: 250, color: '#e4b3e0' }],
        en: 'What colour do you like?', zh: '你喜欢什么颜色？' }
    ]
  },
  {
    id: 'numbers',
    title: 'Count with Me',
    titleZh: '跟我数一数',
    level: 'Level 1 · 数字 1–5',
    pages: [
      { bg: 'kitchen', props: [{ t: 'apple', x: 200, y: 246, s: 2.4 }],
        en: 'One red apple.', zh: '一个红苹果。' },
      { bg: 'kitchen', props: [{ t: 'ball', x: 158, y: 236 }, { t: 'ball', x: 244, y: 236 }],
        en: 'Two red balls.', zh: '两个红球。' },
      { bg: 'garden', props: [{ t: 'duck', x: 120, y: 246, s: 0.9 }, { t: 'duck', x: 200, y: 246, s: 0.9 }, { t: 'duck', x: 280, y: 246, s: 0.9 }],
        en: 'Three little ducks.', zh: '三只小鸭子。' },
      { bg: 'sky', props: [{ t: 'star', x: 110, y: 120, s: 1.6 }, { t: 'star', x: 190, y: 96, s: 1.6 }, { t: 'star', x: 270, y: 124, s: 1.6 }, { t: 'star', x: 340, y: 100, s: 1.6 }],
        en: 'Four little stars.', zh: '四颗小星星。' },
      { bg: 'living', props: [{ t: 'hand', x: 200, y: 170, s: 2.2 }],
        en: 'Five fingers on my hand.', zh: '我的一只手有五根手指。' },
      { bg: 'living', props: [{ t: 'girl', x: 190, y: 244, arm: 'up' }, { t: 'star', x: 300, y: 150, s: 1.5 }],
        en: 'I can count to five!', zh: '我能数到五！' }
    ]
  },
  {
    id: 'farm',
    title: 'On the Farm',
    titleZh: '在农场',
    level: 'Level 1 · 动物',
    pages: [
      { bg: 'sky', props: [{ t: 'cow', x: 120, y: 248, s: 1.1 }, { t: 'sheep', x: 288, y: 248, s: 1.1 }],
        en: 'Look at the farm.', zh: '看这个农场。' },
      { bg: 'sky', props: [{ t: 'cow', x: 190, y: 248, s: 1.45 }],
        en: 'The cow is big.', zh: '奶牛很大。' },
      { bg: 'sky', props: [{ t: 'pig', x: 200, y: 248, s: 1.5 }],
        en: 'The pig is pink.', zh: '小猪是粉色的。' },
      { bg: 'sky', props: [{ t: 'duck', x: 190, y: 248, s: 1.5 }],
        en: 'The duck is small.', zh: '鸭子很小。' },
      { bg: 'sky', props: [{ t: 'sheep', x: 200, y: 248, s: 1.6 }],
        en: 'The sheep is white.', zh: '绵羊是白色的。' },
      { bg: 'sky', props: [{ t: 'girl', x: 110, y: 246, arm: 'up' }, { t: 'cow', x: 268, y: 248, s: 1.05 }],
        en: 'I like the farm.', zh: '我喜欢农场。' }
    ]
  },
  {
    id: 'my-body',
    title: 'My Body',
    titleZh: '我的身体',
    level: 'Level 1 · 身体部位',
    pages: [
      { bg: 'living', props: [{ t: 'girl', x: 250, y: 244 }, { t: 'star', x: 120, y: 130, s: 1.2 }],
        en: 'This is my head.', zh: '这是我的头。' },
      { bg: 'living', props: [{ t: 'eye', x: 200, y: 160, s: 2.1 }],
        en: 'These are my eyes.', zh: '这是我的眼睛。' },
      { bg: 'living', props: [{ t: 'nose', x: 200, y: 170, s: 2.1 }],
        en: 'This is my nose.', zh: '这是我的鼻子。' },
      { bg: 'living', props: [{ t: 'hand', x: 200, y: 170, s: 2.1 }],
        en: 'These are my hands.', zh: '这是我的手。' },
      { bg: 'living', props: [{ t: 'foot', x: 200, y: 200, s: 2.3 }],
        en: 'These are my feet.', zh: '这是我的脚。' },
      { bg: 'living', props: [{ t: 'girl', x: 200, y: 244, arm: 'up' }],
        en: 'I can clap my hands!', zh: '我会拍手！' }
    ]
  },
  {
    id: 'weather',
    title: "What's the Weather?",
    titleZh: '天气怎么样',
    level: 'Level 1 · 天气',
    pages: [
      { bg: 'sky', props: [{ t: 'sun', x: 200, y: 118, s: 1.7 }],
        en: 'Look at the sun.', zh: '看太阳。' },
      { bg: 'sky', props: [{ t: 'sun', x: 300, y: 96, s: 1.1 }, { t: 'girl', x: 120, y: 246 }],
        en: 'It is sunny today.', zh: '今天天晴。' },
      { bg: 'sky', props: [{ t: 'cloud', x: 140, y: 100, s: 1.3 }, { t: 'cloud', x: 290, y: 130, s: 1 }, { t: 'girl', x: 200, y: 246 }],
        en: 'Now it is cloudy.', zh: '现在多云了。' },
      { bg: 'sky', rain: true, props: [{ t: 'cloud', x: 200, y: 90, s: 1.5 }, { t: 'girl', x: 150, y: 246 }],
        en: 'It is raining now.', zh: '现在下雨了。' },
      { bg: 'sky', wind: true, props: [{ t: 'girl', x: 190, y: 246, arm: 'up' }, { t: 'cloud', x: 300, y: 90, s: 1 }],
        en: 'It is windy today.', zh: '今天刮风。' },
      { bg: 'sky', props: [{ t: 'sun', x: 296, y: 100, s: 1.2 }, { t: 'girl', x: 130, y: 246, arm: 'up' }],
        en: 'I like sunny days.', zh: '我喜欢晴天。' }
    ]
  }
];
