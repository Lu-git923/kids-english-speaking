/* 绘本跟读 —— 原创矢量插图 + 英式朗读 + 跟读打分
 * 无第三方依赖；插图由 SVG 现画，零版权风险。
 */
(function () {
  'use strict';

  var STORIES = (window.STORIES || []).concat(window.STORIES2 || []).concat(window.STORIES3 || []);
  var LS = 'kes_story_v1';
  var LS_CAT = 'kes_cat_v1';
  var state = { view: 'list', story: 0, page: 0, recording: false, transcript: '', busy: false, cat: '全部' };

  // 主题分类（按 id 映射，不改动素材文件）
  var CAT_MAP = {
    'coco-ball': '故事', 'bedtime': '故事', 'cat-in-box': '故事',
    'breakfast': '日常', 'at-the-park': '日常', 'new-shoes': '日常', 'at-the-shop': '日常',
    'time-to-wash': '日常', 'get-dressed': '日常', 'time-to-eat': '日常', 'the-toilet': '日常', 'tidy-up': '日常',
    'how-do-you-feel': '情绪',
    'yummy-food': '食物',
    'farm': '动物',
    'colours': '颜色', 'numbers': '数字',
    'my-body': '身体',
    'rain-rain': '天气', 'weather': '天气',
    'busy-morning': '进阶', 'up-the-hill': '进阶'
  };
  var CAT_ORDER = ['全部', '日常', '故事', '情绪', '食物', '动物', '颜色', '数字', '身体', '天气', '进阶'];
  function catOf(s) { return CAT_MAP[s.id] || '其他'; }

  // ---------------- 存储 ----------------
  function loadProg() {
    try { return JSON.parse(localStorage.getItem(LS) || '{}'); } catch (e) { return {}; }
  }
  function saveProg(p) { try { localStorage.setItem(LS, JSON.stringify(p)); } catch (e) {} }
  function setStars(storyId, pageIdx, stars) {
    var p = loadProg();
    p[storyId] = p[storyId] || {};
    p[storyId][pageIdx] = Math.max(p[storyId][pageIdx] || 0, stars);
    saveProg(p);
  }
  function storyStars(storyId, total) {
    var p = loadProg()[storyId] || {}, n = 0;
    for (var i = 0; i < total; i++) if (p[i]) n++;
    return n;
  }

  // ---------------- SVG 场景引擎 ----------------
  var C = {
    skin: '#ffd9b8', skinD: '#f0c39c',
    hair: '#4a3527', hair2: '#6b4b34',
    dress: '#ff9fb2', pj: '#b8d9ff', dadShirt: '#6fb1e8', mumDress: '#c9a8e8',
    dog: '#dcae74', dogD: '#b98a53',
    grass: '#a8dc8a', grassD: '#8cc96d',
    wall: '#f6f1ff', floor: '#e8d8c6', water: '#bfe6f7'
  };

  function bgGarden() {
    return '' +
      '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#d6f0ff"/><stop offset="1" stop-color="#eefbff"/></linearGradient></defs>' +
      '<rect width="400" height="300" fill="url(#sky)"/>' +
      '<circle cx="342" cy="52" r="24" fill="#ffe08a"/>' +
      '<ellipse cx="96" cy="58" rx="34" ry="16" fill="#ffffff" opacity=".9"/>' +
      '<ellipse cx="124" cy="50" rx="22" ry="13" fill="#ffffff" opacity=".9"/>' +
      '<path d="M0 236 Q100 222 200 236 T400 232 L400 300 L0 300 Z" fill="' + C.grass + '"/>' +
      '<path d="M0 252 Q120 244 240 254 T400 250 L400 300 L0 300 Z" fill="' + C.grassD + '" opacity=".55"/>' +
      '<rect x="10" y="196" width="8" height="42" rx="4" fill="#e5c9a3"/>' +
      '<rect x="24" y="196" width="8" height="42" rx="4" fill="#e5c9a3"/>';
  }
  function bgRoom(wall, floor, extra) {
    return '' +
      '<rect width="400" height="300" fill="' + wall + '"/>' +
      '<rect y="232" width="400" height="68" fill="' + floor + '"/>' +
      '<rect y="226" width="400" height="8" fill="' + C.skinD + '" opacity=".25"/>' +
      (extra || '');
  }
  function bgBedroom() {
    return bgRoom(C.wall, C.floor,
      '<rect x="264" y="52" width="96" height="86" rx="8" fill="#cfe9ff" stroke="#fff" stroke-width="6"/>' +
      '<line x1="312" y1="52" x2="312" y2="138" stroke="#fff" stroke-width="6"/>' +
      '<line x1="264" y1="95" x2="360" y2="95" stroke="#fff" stroke-width="6"/>' +
      '<circle cx="300" cy="72" r="9" fill="#ffe08a"/>' +
      '<rect x="28" y="96" width="46" height="58" rx="6" fill="#fff" opacity=".85"/>' +
      '<rect x="34" y="104" width="34" height="42" rx="4" fill="#ffe9a8"/>');
  }
  function bgBathroom() {
    return bgRoom('#e6f6ff', '#d3ebf7',
      '<rect x="24" y="66" width="70" height="94" rx="10" fill="#cbeaff" stroke="#fff" stroke-width="6"/>' +
      '<circle cx="59" cy="86" r="12" fill="#fff" opacity=".7"/>' +
      '<path d="M0 232 h400" stroke="#bcdcee" stroke-width="3"/>' +
      '<circle cx="330" cy="150" r="26" fill="#dff3ff" opacity=".8"/>');
  }

  function bgKitchen() {
    return bgRoom('#fff8ec', '#ecd9c4',
      '<rect x="248" y="46" width="104" height="80" rx="8" fill="#d6ecff" stroke="#fff" stroke-width="6"/>' +
      '<line x1="300" y1="46" x2="300" y2="126" stroke="#fff" stroke-width="6"/>' +
      '<circle cx="288" cy="66" r="9" fill="#ffe08a"/>' +
      '<rect x="20" y="150" width="130" height="10" rx="5" fill="#e2c9ac"/>' +
      '<rect x="26" y="120" width="16" height="30" rx="4" fill="#9fd4a8"/>' +
      '<rect x="48" y="128" width="16" height="22" rx="4" fill="#f0b27a"/>' +
      '<rect x="70" y="118" width="16" height="32" rx="4" fill="#8fc3ef"/>');
  }
  function bgPark() {
    return '' +
      '<defs><linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#d9f2ff"/><stop offset="1" stop-color="#f2fcff"/></linearGradient></defs>' +
      '<rect width="400" height="300" fill="url(#sky2)"/>' +
      '<circle cx="60" cy="54" r="22" fill="#ffe08a"/>' +
      '<ellipse cx="300" cy="56" rx="34" ry="15" fill="#fff" opacity=".9"/>' +
      '<path d="M0 218 Q120 204 240 218 T400 212 L400 300 L0 300 Z" fill="#a8dc8a"/>' +
      '<ellipse cx="196" cy="268" rx="150" ry="26" fill="#f0e2c8"/>' +
      '<path d="M0 250 Q120 242 240 252 T400 248 L400 300 L0 300 Z" fill="#8cc96d" opacity=".5"/>';
  }
  function bgShop() {
    return bgRoom('#f4f9ff', '#e3eaf2',
      '<rect x="24" y="56" width="150" height="10" rx="4" fill="#d8e6f2"/>' +
      '<rect x="24" y="110" width="150" height="10" rx="4" fill="#d8e6f2"/>' +
      '<rect x="34" y="76" width="20" height="34" rx="4" fill="#f7a072"/>' +
      '<rect x="60" y="80" width="20" height="30" rx="4" fill="#9fd4a8"/>' +
      '<rect x="86" y="74" width="20" height="36" rx="4" fill="#8fc3ef"/>' +
      '<rect x="112" y="82" width="20" height="28" rx="4" fill="#e4b3e0"/>' +
      '<rect x="240" y="150" width="140" height="14" rx="6" fill="#c9d9e6"/>' +
      '<rect x="240" y="164" width="140" height="60" rx="6" fill="#dbe7f1"/>');
  }
  function bgLiving() {
    return bgRoom('#fdf1f6', '#e8d6c8',
      '<ellipse cx="200" cy="262" rx="150" ry="24" fill="#f2dbe4"/>' +
      '<rect x="268" y="60" width="86" height="76" rx="6" fill="#fff" stroke="#f0c9d8" stroke-width="6"/>' +
      '<circle cx="311" cy="98" r="18" fill="#ffe08a"/>' +
      '<circle cx="64" cy="74" r="17" fill="#fff" stroke="#e6c9d6" stroke-width="4"/>' +
      '<path d="M64 66 v9 M64 75 h7" stroke="#a58ba0" stroke-width="2" stroke-linecap="round"/>' +
      '<rect x="30" y="182" width="30" height="26" rx="4" fill="#e7b9a1"/>' +
      '<path d="M45 182 q-14 -20 -22 -24 q14 0 22 16 q8 -16 22 -16 q-8 4 -22 24 z" fill="#7ec86a"/>' +
      '<rect x="0" y="224" width="400" height="6" fill="#e2b9c9" opacity=".5"/>');
  }

  function bgSky() {
    return '' +
      '<defs><linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#cfeaff"/><stop offset="1" stop-color="#f4fcff"/></linearGradient></defs>' +
      '<rect width="400" height="300" fill="url(#sky3)"/>' +
      '<path d="M0 240 Q100 228 200 240 T400 236 L400 300 L0 300 Z" fill="#a8dc8a"/>' +
      '<path d="M0 258 Q120 250 240 260 T400 256 L400 300 L0 300 Z" fill="#8cc96d" opacity=".5"/>';
  }

  function girlBody(x, y, opt) {
    opt = opt || {};
    var dress = opt.pj ? C.pj : C.dress;
    var hair = opt.hair || C.hair;
    var arm = opt.arm;
    var armUp = arm === 'up';
    var s = '';
    s += '<line x1="' + (x - 5) + '" y1="' + (y - 18) + '" x2="' + (x - 6) + '" y2="' + y + '" stroke="' + C.skin + '" stroke-width="6" stroke-linecap="round"/>';
    s += '<line x1="' + (x + 5) + '" y1="' + (y - 18) + '" x2="' + (x + 6) + '" y2="' + y + '" stroke="' + C.skin + '" stroke-width="6" stroke-linecap="round"/>';
    s += '<rect x="' + (x - 11) + '" y="' + (y - 46) + '" width="22" height="30" rx="10" fill="' + dress + '"/>';
    if (armUp) {
      s += '<line x1="' + (x - 9) + '" y1="' + (y - 40) + '" x2="' + (x - 20) + '" y2="' + (y - 62) + '" stroke="' + C.skin + '" stroke-width="5.5" stroke-linecap="round"/>';
      s += '<line x1="' + (x + 9) + '" y1="' + (y - 40) + '" x2="' + (x + 20) + '" y2="' + (y - 62) + '" stroke="' + C.skin + '" stroke-width="5.5" stroke-linecap="round"/>';
    } else {
      s += '<line x1="' + (x - 10) + '" y1="' + (y - 38) + '" x2="' + (x - 16) + '" y2="' + (y - 20) + '" stroke="' + C.skin + '" stroke-width="5.5" stroke-linecap="round"/>';
      s += '<line x1="' + (x + 10) + '" y1="' + (y - 38) + '" x2="' + (x + 16) + '" y2="' + (y - 20) + '" stroke="' + C.skin + '" stroke-width="5.5" stroke-linecap="round"/>';
    }
    s += '<circle cx="' + x + '" cy="' + (y - 57) + '" r="13" fill="' + C.skin + '"/>';
    s += '<path d="M' + (x - 14) + ' ' + (y - 60) + ' q0 -16 14 -16 q14 0 14 16 q-3 -6 -14 -6 q-11 0 -14 6 z" fill="' + hair + '"/>';
    if (!opt.pj) s += '<circle cx="' + (x + 8) + '" cy="' + (y - 64) + '" r="4.5" fill="' + C.hair + '"/>';
    s += '<circle cx="' + (x - 4) + '" cy="' + (y - 56) + '" r="1.6" fill="#3a2a20"/>';
    s += '<circle cx="' + (x + 5) + '" cy="' + (y - 56) + '" r="1.6" fill="#3a2a20"/>';
    var face = opt.face || 'smile';
    if (face === 'happy') {
      s += '<circle cx="' + (x - 4) + '" cy="' + (y - 57) + '" r="2.4" fill="#3a2a20"/>';
      s += '<circle cx="' + (x + 5) + '" cy="' + (y - 57) + '" r="2.4" fill="#3a2a20"/>';
      s += '<path d="M' + (x - 6) + ' ' + (y - 50) + ' q6 7 12 0" stroke="#b5744f" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
    } else if (face === 'sad') {
      s += '<path d="M' + (x - 7) + ' ' + (y - 59) + ' q3 -3 6 0" stroke="#8a6247" stroke-width="1.4" fill="none"/>';
      s += '<path d="M' + (x - 3) + ' ' + (y - 49) + ' q3 -4 6 0" stroke="#b5744f" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
      s += '<circle cx="' + (x - 7) + '" cy="' + (y - 52) + '" r="1.8" fill="#8fc3ef"/>';
    } else if (face === 'angry') {
      s += '<path d="M' + (x - 8) + ' ' + (y - 60) + ' l6 3" stroke="#6b4b34" stroke-width="1.8" stroke-linecap="round"/>';
      s += '<path d="M' + (x + 1) + ' ' + (y - 57) + ' l6 -3" stroke="#6b4b34" stroke-width="1.8" stroke-linecap="round"/>';
      s += '<path d="M' + (x - 5) + ' ' + (y - 49) + ' h10" stroke="#b5744f" stroke-width="1.8" stroke-linecap="round"/>';
    } else if (face === 'tired') {
      s += '<path d="M' + (x - 7) + ' ' + (y - 56) + ' h5" stroke="#3a2a20" stroke-width="1.6" stroke-linecap="round"/>';
      s += '<path d="M' + (x + 2) + ' ' + (y - 56) + ' h5" stroke="#3a2a20" stroke-width="1.6" stroke-linecap="round"/>';
      s += '<ellipse cx="' + x + '" cy="' + (y - 49) + '" rx="2.4" ry="3" fill="#b5744f"/>';
    } else if (face === 'scared') {
      s += '<circle cx="' + (x - 4) + '" cy="' + (y - 56) + '" r="3" fill="#fff" stroke="#3a2a20" stroke-width="1"/>';
      s += '<circle cx="' + (x + 5) + '" cy="' + (y - 56) + '" r="3" fill="#fff" stroke="#3a2a20" stroke-width="1"/>';
      s += '<ellipse cx="' + x + '" cy="' + (y - 48) + '" rx="3" ry="4" fill="#b5744f"/>';
    } else {
      s += '<path d="M' + (x - 3) + ' ' + (y - 50) + ' q3 3 6 0" stroke="#b5744f" stroke-width="1.6" fill="none" stroke-linecap="round"/>';
    }
    return s;
  }

  function adult(x, y, kind, opt) {
    opt = opt || {};
    var isDad = kind === 'dad';
    var body = isDad ? C.dadShirt : C.mumDress;
    var top = y - 60;
    var s = '';
    s += '<line x1="' + (x - 6) + '" y1="' + (y - 24) + '" x2="' + (x - 7) + '" y2="' + y + '" stroke="#3f5470" stroke-width="7" stroke-linecap="round"/>';
    s += '<line x1="' + (x + 6) + '" y1="' + (y - 24) + '" x2="' + (x + 7) + '" y2="' + y + '" stroke="#3f5470" stroke-width="7" stroke-linecap="round"/>';
    s += '<rect x="' + (x - 14) + '" y="' + top + '" width="28" height="38" rx="12" fill="' + body + '"/>';
    if (opt.arm === 'up') {
      s += '<line x1="' + (x - 12) + '" y1="' + (top + 8) + '" x2="' + (x - 22) + '" y2="' + (top - 20) + '" stroke="' + C.skin + '" stroke-width="6" stroke-linecap="round"/>';
      s += '<line x1="' + (x + 12) + '" y1="' + (top + 8) + '" x2="' + (x + 22) + '" y2="' + (top - 20) + '" stroke="' + C.skin + '" stroke-width="6" stroke-linecap="round"/>';
    } else {
      s += '<line x1="' + (x - 13) + '" y1="' + (top + 10) + '" x2="' + (x - 19) + '" y2="' + (top + 34) + '" stroke="' + C.skin + '" stroke-width="6" stroke-linecap="round"/>';
      s += '<line x1="' + (x + 13) + '" y1="' + (top + 10) + '" x2="' + (x + 19) + '" y2="' + (top + 34) + '" stroke="' + C.skin + '" stroke-width="6" stroke-linecap="round"/>';
    }
    s += '<circle cx="' + x + '" cy="' + (top - 13) + '" r="14" fill="' + C.skin + '"/>';
    if (isDad) {
      s += '<path d="M' + (x - 15) + ' ' + (top - 16) + ' q0 -18 15 -18 q15 0 15 18 q-4 -7 -15 -7 q-11 0 -15 7 z" fill="#2f2a26"/>';
    } else {
      s += '<path d="M' + (x - 16) + ' ' + (top - 10) + ' q-4 -22 16 -22 q20 0 16 22 q-2 12 -8 14 q6 -16 -8 -18 q-14 -2 -16 4 z" fill="#513a2c"/>';
    }
    s += '<circle cx="' + (x - 4) + '" cy="' + (top - 12) + '" r="1.6" fill="#3a2a20"/>';
    s += '<circle cx="' + (x + 5) + '" cy="' + (top - 12) + '" r="1.6" fill="#3a2a20"/>';
    s += '<path d="M' + (x - 4) + ' ' + (top - 6) + ' q4 4 8 0" stroke="#b5744f" stroke-width="1.6" fill="none" stroke-linecap="round"/>';
    return s;
  }

  function dog(x, y, opt) {
    opt = opt || {};
    var run = !!opt.run;
    var s = '';
    s += '<ellipse cx="' + x + '" cy="' + (y - 16) + '" rx="23" ry="13" fill="' + C.dog + '"/>';
    var legs = run ? [[-18, 8], [-6, 12], [6, -10], [16, 6]] : [[-18, 0], [-6, 0], [6, 0], [16, 0]];
    for (var i = 0; i < legs.length; i++) {
      s += '<line x1="' + (x + legs[i][0]) + '" y1="' + (y - 10) + '" x2="' + (x + legs[i][0] + legs[i][1]) + '" y2="' + y + '" stroke="' + C.dogD + '" stroke-width="5" stroke-linecap="round"/>';
    }
    s += '<circle cx="' + (x + 22) + '" cy="' + (y - 26) + '" r="11" fill="' + C.dog + '"/>';
    s += '<ellipse cx="' + (x + 17) + '" cy="' + (y - 34) + '" rx="4" ry="7" fill="' + C.dogD + '" transform="rotate(-18 ' + (x + 17) + ' ' + (y - 34) + ')"/>';
    s += '<ellipse cx="' + (x + 27) + '" cy="' + (y - 34) + '" rx="4" ry="7" fill="' + C.dogD + '" transform="rotate(18 ' + (x + 27) + ' ' + (y - 34) + ')"/>';
    s += '<circle cx="' + (x + 30) + '" cy="' + (y - 22) + '" r="3.2" fill="#3a2a20"/>';
    s += '<circle cx="' + (x + 19) + '" cy="' + (y - 28) + '" r="1.5" fill="#3a2a20"/>';
    s += '<path d="M' + (x - 22) + ' ' + (y - 22) + ' q-8 -8 -3 -14" stroke="' + C.dogD + '" stroke-width="5" fill="none" stroke-linecap="round"/>';
    if (run) s += '<path d="M' + (x - 34) + ' ' + (y - 26) + ' h12 M' + (x - 40) + ' ' + (y - 16) + ' h10" stroke="#bcd7e6" stroke-width="2.5" stroke-linecap="round"/>';
    return s;
  }

  function ball(x, y, s2) {
    var sc = s2 || 1, r = 10 * sc;
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#ef5350"/>' +
      '<path d="M' + (x - r) + ' ' + y + ' q' + r + ' -' + (r * 0.7) + ' ' + (2 * r) + ' 0" stroke="#fff" stroke-width="2.4" fill="none"/>' +
      '<circle cx="' + (x - r * 0.3) + '" cy="' + (y - r * 0.35) + '" r="' + (r * 0.22) + '" fill="#fff" opacity=".55"/>';
  }

  function tree(x, y) {
    return '<rect x="' + (x - 7) + '" y="' + (y - 62) + '" width="14" height="64" rx="6" fill="#b08150"/>' +
      '<circle cx="' + x + '" cy="' + (y - 78) + '" r="30" fill="#7ec86a"/>' +
      '<circle cx="' + (x - 22) + '" cy="' + (y - 62) + '" r="21" fill="#8fd47a"/>' +
      '<circle cx="' + (x + 22) + '" cy="' + (y - 62) + '" r="21" fill="#8fd47a"/>' +
      '<circle cx="' + (x - 8) + '" cy="' + (y - 88) + '" r="7" fill="#ef5350" opacity=".85"/>';
  }

  function bed(x, y) {
    return '<rect x="' + (x - 62) + '" y="' + (y - 34) + '" width="124" height="34" rx="8" fill="#c39a6f"/>' +
      '<rect x="' + (x - 58) + '" y="' + (y - 44) + '" width="116" height="16" rx="8" fill="#fff"/>' +
      '<rect x="' + (x - 54) + '" y="' + (y - 40) + '" width="34" height="12" rx="6" fill="#dceeff"/>' +
      '<rect x="' + (x - 8) + '" y="' + (y - 42) + '" width="66" height="14" rx="7" fill="#a8c7ef"/>' +
      '<rect x="' + (x - 62) + '" y="' + (y - 62) + '" width="10" height="30" rx="5" fill="#b08150"/>';
  }

  function teddy(x, y, s2) {
    var sc = s2 || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + sc + ')">' +
      '<ellipse cx="0" cy="-10" rx="11" ry="10" fill="#c99a6b"/>' +
      '<circle cx="-7" cy="-19" r="4" fill="#c99a6b"/><circle cx="7" cy="-19" r="4" fill="#c99a6b"/>' +
      '<circle cx="0" cy="-22" r="9" fill="#d8ab7c"/>' +
      '<circle cx="-3" cy="-23" r="1.4" fill="#3a2a20"/><circle cx="3" cy="-23" r="1.4" fill="#3a2a20"/>' +
      '<ellipse cx="0" cy="-19" rx="4" ry="3" fill="#f0d6bb"/></g>';
  }

  function tub(x, y) {
    return '<rect x="' + (x - 58) + '" y="' + (y - 34) + '" width="116" height="34" rx="14" fill="#fff" stroke="#bfe0f2" stroke-width="3"/>' +
      '<rect x="' + (x - 54) + '" y="' + (y - 30) + '" width="108" height="14" rx="7" fill="' + C.water + '"/>' +
      '<rect x="' + (x - 62) + '" y="' + (y - 40) + '" width="124" height="8" rx="4" fill="#e6f4fb"/>' +
      '<circle cx="' + (x - 30) + '" cy="' + (y - 44) + '" r="5" fill="#eaf8ff" opacity=".9"/>' +
      '<circle cx="' + (x + 26) + '" cy="' + (y - 48) + '" r="7" fill="#eaf8ff" opacity=".9"/>';
  }

  function cat(x, y, s2) {
    var c = s2 || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + c + ')">' +
      '<ellipse cx="0" cy="-14" rx="20" ry="12" fill="#9aa7b3"/>' +
      '<circle cx="16" cy="-26" r="10" fill="#a7b3bf"/>' +
      '<path d="M9 -34 l3 -9 l6 7 z" fill="#a7b3bf"/><path d="M22 -34 l4 -9 l5 8 z" fill="#a7b3bf"/>' +
      '<circle cx="13" cy="-27" r="1.5" fill="#2d3742"/><circle cx="20" cy="-27" r="1.5" fill="#2d3742"/>' +
      '<path d="M15 -22 q2 2 4 0" stroke="#7d8a96" stroke-width="1.4" fill="none"/>' +
      '<path d="M-20 -18 q-10 -4 -6 -14" stroke="#8d99a5" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<line x1="-12" y1="-4" x2="-12" y2="0" stroke="#8d99a5" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="8" y1="-4" x2="8" y2="0" stroke="#8d99a5" stroke-width="4" stroke-linecap="round"/></g>';
  }
  function box(x, y, s2) {
    var c = s2 || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + c + ')">' +
      '<rect x="-34" y="-30" width="68" height="30" rx="3" fill="#d2a679"/>' +
      '<path d="M-34 -30 l-12 -14 l24 -4 z" fill="#e0b98f"/>' +
      '<path d="M34 -30 l12 -14 l-24 -4 z" fill="#e0b98f"/>' +
      '<rect x="-34" y="-30" width="68" height="8" fill="#c4936a"/></g>';
  }
  function table(x, y) {
    return '<rect x="' + (x - 46) + '" y="' + (y - 40) + '" width="92" height="9" rx="4" fill="#d8b48a"/>' +
      '<rect x="' + (x - 38) + '" y="' + (y - 32) + '" width="7" height="32" rx="3" fill="#bd9469"/>' +
      '<rect x="' + (x + 31) + '" y="' + (y - 32) + '" width="7" height="32" rx="3" fill="#bd9469"/>' +
      '<ellipse cx="' + (x - 14) + '" cy="' + (y - 43) + '" rx="15" ry="5" fill="#fff"/>' +
      '<ellipse cx="' + (x - 14) + '" cy="' + (y - 44) + '" rx="9" ry="3" fill="#ffe1a8"/>' +
      '<rect x="' + (x + 14) + '" y="' + (y - 54) + '" width="14" height="15" rx="2" fill="#fff" stroke="#dbe7f1" stroke-width="2"/>' +
      '<rect x="' + (x + 14) + '" y="' + (y - 42) + '" width="14" height="6" rx="2" fill="#cfe3f0"/>';
  }
  function slide(x, y) {
    return '<rect x="' + (x - 52) + '" y="' + (y - 74) + '" width="7" height="74" rx="3" fill="#9fb6c9"/>' +
      '<rect x="' + (x - 16) + '" y="' + (y - 82) + '" width="7" height="82" rx="3" fill="#9fb6c9"/>' +
      '<rect x="' + (x - 54) + '" y="' + (y - 78) + '" width="44" height="7" rx="3" fill="#8fc3ef"/>' +
      '<path d="M' + (x - 52) + ' ' + (y - 82) + ' q 26 -6 34 10 l 22 62" stroke="#f7a072" stroke-width="9" fill="none" stroke-linecap="round"/>' +
      '<circle cx="' + (x - 36) + '" cy="' + (y - 40) + '" r="3" fill="#8fa7bb"/>' +
      '<circle cx="' + (x - 36) + '" cy="' + (y - 24) + '" r="3" fill="#8fa7bb"/>';
  }
  function apple(x, y, s2) {
    var c = s2 || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + c + ')">' +
      '<circle cx="0" cy="-9" r="9" fill="#e8544b"/><path d="M0 -18 q1 -5 5 -6" stroke="#7c5a3a" stroke-width="2" fill="none"/>' +
      '<ellipse cx="5" cy="-19" rx="5" ry="3" fill="#6fbf5f" transform="rotate(-20 5 -19)"/></g>';
  }
  function shoes(x, y) {
    return '<path d="M' + (x - 26) + ' ' + y + ' q-2 -12 10 -12 q8 0 10 6 q2 6 -8 6 z" fill="#e8544b"/>' +
      '<path d="M' + (x - 4) + ' ' + y + ' q-2 -12 10 -12 q8 0 10 6 q2 6 -8 6 z" fill="#4a90d9"/>';
  }
  function coat(x, y) {
    return '<path d="M' + (x - 16) + ' ' + (y - 46) + ' q16 -8 32 0 l6 44 q-22 8 -44 0 z" fill="#f2b134"/>' +
      '<path d="M' + x + ' ' + (y - 46) + ' v44" stroke="#d99a1e" stroke-width="2"/>' +
      '<circle cx="' + x + '" cy="' + (y - 52) + '" r="4" fill="#d99a1e"/>';
  }
  function sofa(x, y) {
    return '<rect x="' + (x - 62) + '" y="' + (y - 40) + '" width="124" height="40" rx="14" fill="#a8b8d8"/>' +
      '<rect x="' + (x - 62) + '" y="' + (y - 54) + '" width="124" height="20" rx="10" fill="#bccbe6"/>' +
      '<rect x="' + (x - 54) + '" y="' + (y - 34) + '" width="44" height="16" rx="8" fill="#d3ddf0"/>' +
      '<rect x="' + (x + 8) + '" y="' + (y - 34) + '" width="44" height="16" rx="8" fill="#d3ddf0"/>';
  }

  function balloon(x, y, color, s2) {
    var c = s2 || 1, cy = y - 58 * c, r = 15 * c;
    return '<path d="M' + x + ' ' + (cy + r) + ' q-8 ' + (18 * c) + ' 0 ' + (28 * c) + '" stroke="#c3cfd9" stroke-width="1.6" fill="none"/>' +
      '<ellipse cx="' + x + '" cy="' + cy + '" rx="' + r + '" ry="' + (r * 1.15) + '" fill="' + color + '"/>' +
      '<ellipse cx="' + (x - r * 0.3) + '" cy="' + (cy - r * 0.45) + '" rx="' + (r * 0.28) + '" ry="' + (r * 0.4) + '" fill="#fff" opacity=".55"/>' +
      '<path d="M' + (x - 3 * c) + ' ' + (cy + r * 1.1) + ' l' + (6 * c) + ' 0 l' + (-3 * c) + ' ' + (5 * c) + ' z" fill="' + color + '"/>';
  }
  function duck(x, y, s2) {
    var c = s2 || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + c + ')">' +
      '<ellipse cx="0" cy="-12" rx="18" ry="11" fill="#ffd84d"/>' +
      '<circle cx="14" cy="-26" r="9" fill="#ffe066"/>' +
      '<path d="M22 -27 l9 3 l-9 3 z" fill="#f2994a"/>' +
      '<circle cx="16" cy="-28" r="1.5" fill="#3a2a20"/>' +
      '<path d="M-16 -16 q-6 -4 -2 -10" stroke="#e8bf3a" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<line x1="-8" y1="-3" x2="-8" y2="0" stroke="#f2994a" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="7" y1="-3" x2="7" y2="0" stroke="#f2994a" stroke-width="3" stroke-linecap="round"/></g>';
  }
  function cow(x, y, s2) {
    var c = s2 || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + c + ')">' +
      '<ellipse cx="0" cy="-24" rx="24" ry="14" fill="#fff"/>' +
      '<ellipse cx="-8" cy="-28" rx="7" ry="5" fill="#333"/><ellipse cx="10" cy="-20" rx="6" ry="4" fill="#333"/>' +
      '<circle cx="24" cy="-32" r="10" fill="#fff"/>' +
      '<circle cx="30" cy="-30" r="4" fill="#f6c1c1"/>' +
      '<circle cx="27" cy="-35" r="1.4" fill="#333"/>' +
      '<path d="M18 -41 q-4 -6 2 -8" stroke="#c9a06a" stroke-width="3" fill="none"/>' +
      '<path d="M30 -42 q4 -6 8 -4" stroke="#c9a06a" stroke-width="3" fill="none"/>' +
      '<line x1="-16" y1="-11" x2="-16" y2="0" stroke="#ddd" stroke-width="5" stroke-linecap="round"/>' +
      '<line x1="-4" y1="-11" x2="-4" y2="0" stroke="#ddd" stroke-width="5" stroke-linecap="round"/>' +
      '<line x1="10" y1="-11" x2="10" y2="0" stroke="#ddd" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M-24 -26 q-8 4 -6 12" stroke="#c9a06a" stroke-width="3" fill="none"/></g>';
  }
  function pig(x, y, s2) {
    var c = s2 || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + c + ')">' +
      '<ellipse cx="0" cy="-16" rx="20" ry="12" fill="#f6b8cc"/>' +
      '<circle cx="17" cy="-24" r="10" fill="#f9c9d8"/>' +
      '<ellipse cx="24" cy="-22" rx="5" ry="4" fill="#ef9db8"/>' +
      '<circle cx="23" cy="-23" r="1" fill="#b96f88"/><circle cx="26" cy="-23" r="1" fill="#b96f88"/>' +
      '<path d="M10 -33 l3 -7 l7 5 z" fill="#ef9db8"/><path d="M24 -33 l-2 -7 l-7 5 z" fill="#ef9db8"/>' +
      '<circle cx="14" cy="-26" r="1.4" fill="#5b3a45"/>' +
      '<line x1="-12" y1="-5" x2="-12" y2="0" stroke="#ef9db8" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="4" y1="-5" x2="4" y2="0" stroke="#ef9db8" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M-20 -18 q-6 -2 -6 -8" stroke="#ef9db8" stroke-width="3" fill="none"/></g>';
  }
  function sheep(x, y, s2) {
    var c = s2 || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + c + ')">' +
      '<circle cx="-14" cy="-22" r="10" fill="#fff"/><circle cx="0" cy="-26" r="12" fill="#fff"/>' +
      '<circle cx="14" cy="-22" r="10" fill="#fff"/><circle cx="-6" cy="-14" r="9" fill="#fff"/><circle cx="8" cy="-14" r="9" fill="#fff"/>' +
      '<circle cx="22" cy="-28" r="7" fill="#e9e2d6"/>' +
      '<circle cx="25" cy="-29" r="1.3" fill="#4a4038"/><circle cx="21" cy="-33" r="1.6" fill="#4a4038"/>' +
      '<line x1="-10" y1="-8" x2="-10" y2="0" stroke="#d8d0c4" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="4" y1="-8" x2="4" y2="0" stroke="#d8d0c4" stroke-width="4" stroke-linecap="round"/></g>';
  }
  function sun(x, y, s2) {
    var c = s2 || 1, r = 20 * c, rays = '';
    for (var i = 0; i < 8; i++) {
      var a = (Math.PI * 2 / 8) * i;
      rays += '<line x1="' + (x + Math.cos(a) * r * 1.25) + '" y1="' + (y + Math.sin(a) * r * 1.25) + '" x2="' + (x + Math.cos(a) * r * 1.65) + '" y2="' + (y + Math.sin(a) * r * 1.65) + '" stroke="#ffb703" stroke-width="4" stroke-linecap="round"/>';
    }
    return rays + '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#ffe08a"/><circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.72) + '" fill="#ffd05e"/>';
  }
  function cloud(x, y, s2) {
    var c = s2 || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + c + ')">' +
      '<ellipse cx="0" cy="0" rx="28" ry="16" fill="#fff"/>' +
      '<circle cx="-14" cy="-8" r="14" fill="#fff"/><circle cx="8" cy="-12" r="17" fill="#fff"/>' +
      '<circle cx="24" cy="-2" r="12" fill="#fff"/></g>';
  }
  function blocks(x, y) {
    var cols = ['#e8544b', '#4a90d9', '#f2b134'];
    var s = '';
    for (var i = 0; i < 3; i++) {
      s += '<rect x="' + (x - 16 + i * 17) + '" y="' + (y - 16 - (i === 1 ? 16 : 0)) + '" width="16" height="16" rx="3" fill="' + cols[i] + '" stroke="#00000012" stroke-width="1"/>';
    }
    return s;
  }
  function star(x, y, s2) {
    var c = s2 || 1, p = '', i, a, r1 = 10 * c, r2 = 4.4 * c;
    for (i = 0; i < 10; i++) {
      a = -Math.PI / 2 + i * Math.PI / 5;
      var rr = i % 2 ? r2 : r1;
      p += (i ? 'L' : 'M') + (x + Math.cos(a) * rr).toFixed(1) + ' ' + (y + Math.sin(a) * rr).toFixed(1) + ' ';
    }
    return '<path d="' + p + 'Z" fill="#ffd05e" stroke="#f2b134" stroke-width="1"/>';
  }
  function eyeIcon(x, y, s2) {
    var c = s2 || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + c + ')">' +
      '<path d="M-26 0 q26 -22 52 0 q-26 22 -52 0 z" fill="#fff" stroke="#8fa7bb" stroke-width="2"/>' +
      '<circle cx="0" cy="0" r="11" fill="#7fb2d9"/><circle cx="0" cy="0" r="5.5" fill="#2d3742"/>' +
      '<circle cx="-4" cy="-4" r="2.4" fill="#fff" opacity=".9"/>' +
      '<path d="M-22 -12 l-4 -6 M0 -14 l0 -7 M22 -12 l4 -6" stroke="#8fa7bb" stroke-width="2" stroke-linecap="round"/></g>';
  }
  function noseIcon(x, y, s2) {
    var c = s2 || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + c + ')">' +
      '<path d="M-10 -14 q10 4 6 16 q-2 8 -10 8" stroke="#c9855f" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M-4 6 q8 6 16 0" stroke="#c9855f" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<circle cx="-2" cy="4" r="2" fill="#b5744f"/><circle cx="8" cy="4" r="2" fill="#b5744f"/></g>';
  }
  function handIcon(x, y, s2) {
    var c = s2 || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + c + ')">' +
      '<rect x="-14" y="-20" width="28" height="30" rx="10" fill="#ffd9b8"/>' +
      '<rect x="-13" y="-34" width="7" height="18" rx="3.5" fill="#ffd9b8"/>' +
      '<rect x="-4" y="-38" width="7" height="22" rx="3.5" fill="#ffd9b8"/>' +
      '<rect x="5" y="-35" width="7" height="19" rx="3.5" fill="#ffd9b8"/>' +
      '<rect x="-24" y="-14" width="9" height="16" rx="4.5" fill="#ffd9b8" transform="rotate(-25 -24 -14)"/>' +
      '<rect x="-12" y="6" width="24" height="8" rx="4" fill="#f0c39c"/></g>';
  }
  function footIcon(x, y, s2) {
    var c = s2 || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + c + ')">' +
      '<path d="M-8 -34 q10 0 11 14 q1 12 8 16 q6 4 -2 6 q-16 2 -22 -8 q-4 -8 0 -20 z" fill="#ffd9b8"/>' +
      '<circle cx="-8" cy="-3" r="3" fill="#f0c39c"/><circle cx="-1" cy="-3" r="2.6" fill="#f0c39c"/><circle cx="5" cy="-4" r="2.4" fill="#f0c39c"/></g>';
  }

  function sink(x, y) {
    return '<rect x="' + (x - 30) + '" y="' + (y - 26) + '" width="60" height="26" rx="8" fill="#fff" stroke="#cfe3f0" stroke-width="3"/>' +
      '<ellipse cx="' + x + '" cy="' + (y - 24) + '" rx="24" ry="7" fill="#dff1fb"/>' +
      '<rect x="' + (x - 3) + '" y="' + (y - 56) + '" width="6" height="24" rx="3" fill="#b9cddb"/>' +
      '<path d="M' + (x + 3) + ' ' + (y - 56) + ' q12 0 12 10" stroke="#b9cddb" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<circle cx="' + (x - 20) + '" cy="' + (y - 44) + '" r="4" fill="#8fc3ef" opacity=".7"/>' +
      '<circle cx="' + (x - 10) + '" cy="' + (y - 36) + '" r="3" fill="#8fc3ef" opacity=".5"/>';
  }
  function toilet(x, y) {
    return '<rect x="' + (x - 16) + '" y="' + (y - 58) + '" width="32" height="22" rx="5" fill="#eef6fb" stroke="#cfe3f0" stroke-width="3"/>' +
      '<rect x="' + (x - 22) + '" y="' + (y - 36) + '" width="44" height="10" rx="5" fill="#fff" stroke="#cfe3f0" stroke-width="3"/>' +
      '<path d="M' + (x - 20) + ' ' + (y - 28) + ' q20 12 40 0 l-4 20 q-16 8 -32 0 z" fill="#fff" stroke="#cfe3f0" stroke-width="3"/>' +
      '<rect x="' + (x - 10) + '" y="' + (y - 4) + '" width="20" height="4" rx="2" fill="#dbe7f1"/>';
  }
  function shirt(x, y, color) {
    var c = color || '#7fb2d9';
    return '<path d="M' + (x - 20) + ' ' + (y - 44) + ' l10 -6 h20 l10 6 l-6 12 l-6 -4 v36 h-28 v-36 l-6 4 z" fill="' + c + '"/>' +
      '<path d="M' + (x - 6) + ' ' + (y - 50) + ' q6 6 12 0" stroke="#ffffff" stroke-width="2" fill="none"/>';
  }
  function banana(x, y, s2) {
    var c = s2 || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + c + ')">' +
      '<path d="M-16 0 q6 -26 32 -22 q-10 20 -30 26" fill="#ffd84d" stroke="#e8bf3a" stroke-width="1.5"/>' +
      '<path d="M16 -22 l4 -4" stroke="#7d6a3a" stroke-width="3" stroke-linecap="round"/></g>';
  }
  function cake(x, y, s2) {
    var c = s2 || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + c + ')">' +
      '<path d="M-20 0 l16 -8 l24 4 l-6 6 z" fill="#ffe0b2"/>' +
      '<path d="M-22 -4 l6 -20 h30 l4 18 z" fill="#f7c9a1"/>' +
      '<path d="M-16 -20 h30 l2 8 h-34 z" fill="#fff3e0"/>' +
      '<circle cx="4" cy="-26" r="4" fill="#ef5350"/>' +
      '<path d="M4 -30 q2 -6 6 -7" stroke="#7c5a3a" stroke-width="1.6" fill="none"/></g>';
  }
  function milk(x, y, s2) {
    var c = s2 || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + c + ')">' +
      '<path d="M-9 -30 h18 v30 h-18 z" fill="#ffffff" stroke="#cfe3f0" stroke-width="2"/>' +
      '<path d="M-9 -16 h18 v14 h-18 z" fill="#fdf7f0"/>' +
      '<rect x="-9" y="-30" width="18" height="5" fill="#e8f4ff"/></g>';
  }

  function scene(page, compact) {
    var bg = page.bg;
    var out = '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img">';
    if (bg === 'garden') out += bgGarden();
    else if (bg === 'bedroom') out += bgBedroom();
    else if (bg === 'bathroom') out += bgBathroom();
    else if (bg === 'kitchen') out += bgKitchen();
    else if (bg === 'park') out += bgPark();
    else if (bg === 'shop') out += bgShop();
    else if (bg === 'living') out += bgLiving();
    else if (bg === 'sky') out += bgSky();
    else out += bgRoom(C.wall, C.floor, '');

    (page.props || []).forEach(function (p) {
      var s = p.s || 1;
      // 落地阴影，避免人物“浮”在空中
      if (p.t !== 'ball' && p.t !== 'apple' && p.t !== 'coat') {
        var wide = { bed: 56, tub: 56, sofa: 58, box: 40, table: 44, tree: 26, slide: 30 };
        out += '<ellipse cx="' + p.x + '" cy="' + (p.y + 2) + '" rx="' + (wide[p.t] || 18) + '" ry="5" fill="#3d2b1a" opacity=".12"/>';
      }
      if (p.t === 'girl') out += girlBody(p.x, p.y, p);
      else if (p.t === 'dad' || p.t === 'mum') out += adult(p.x, p.y, p.t, p);
      else if (p.t === 'dog') out += dog(p.x, p.y, p);
      else if (p.t === 'ball') out += ball(p.x, p.y, s);
      else if (p.t === 'tree') out += tree(p.x, p.y);
      else if (p.t === 'bed') out += bed(p.x, p.y);
      else if (p.t === 'teddy') out += teddy(p.x, p.y, s);
      else if (p.t === 'tub') out += tub(p.x, p.y);
      else if (p.t === 'cat') out += cat(p.x, p.y, s);
      else if (p.t === 'box') out += box(p.x, p.y, s);
      else if (p.t === 'table') out += table(p.x, p.y);
      else if (p.t === 'slide') out += slide(p.x, p.y);
      else if (p.t === 'apple') out += apple(p.x, p.y, s);
      else if (p.t === 'shoes') out += shoes(p.x, p.y);
      else if (p.t === 'coat') out += coat(p.x, p.y);
      else if (p.t === 'sofa') out += sofa(p.x, p.y);
      else if (p.t === 'balloon') out += balloon(p.x, p.y, p.color || '#ef5350', s);
      else if (p.t === 'duck') out += duck(p.x, p.y, s);
      else if (p.t === 'cow') out += cow(p.x, p.y, s);
      else if (p.t === 'pig') out += pig(p.x, p.y, s);
      else if (p.t === 'sheep') out += sheep(p.x, p.y, s);
      else if (p.t === 'sun') out += sun(p.x, p.y, s);
      else if (p.t === 'cloud') out += cloud(p.x, p.y, s);
      else if (p.t === 'blocks') out += blocks(p.x, p.y);
      else if (p.t === 'star') out += star(p.x, p.y, s);
      else if (p.t === 'eye') out += eyeIcon(p.x, p.y, s);
      else if (p.t === 'nose') out += noseIcon(p.x, p.y, s);
      else if (p.t === 'hand') out += handIcon(p.x, p.y, s);
      else if (p.t === 'foot') out += footIcon(p.x, p.y, s);
      else if (p.t === 'sink') out += sink(p.x, p.y);
      else if (p.t === 'toilet') out += toilet(p.x, p.y);
      else if (p.t === 'shirt') out += shirt(p.x, p.y, p.color);
      else if (p.t === 'banana') out += banana(p.x, p.y, s);
      else if (p.t === 'cake') out += cake(p.x, p.y, s);
      else if (p.t === 'milk') out += milk(p.x, p.y, s);
    });

    if (page.snow) {
      var flakes = '';
      for (var f = 0; f < 40; f++) {
        var fx = (f * 83) % 400, fy = (f * 47) % 290;
        flakes += '<circle cx="' + fx + '" cy="' + fy + '" r="' + (2 + (f % 3)) + '" fill="#fff" opacity=".85"/>';
      }
      out += flakes;
    }
    if (page.wind) {
      var wind = '';
      for (var w = 0; w < 7; w++) {
        var wy = 40 + w * 32;
        wind += '<path d="M' + (30 + (w % 3) * 20) + ' ' + wy + ' q30 -10 60 0 q26 9 52 -2" stroke="#9fc6dd" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".75"/>';
      }
      out += wind;
    }

    if (page.rain) {
      var drops = '';
      for (var i = 0; i < 46; i++) {
        var rx = (i * 97) % 400, ry = (i * 61) % 300;
        drops += '<line x1="' + rx + '" y1="' + ry + '" x2="' + (rx - 6) + '" y2="' + (ry + 14) + '" stroke="#8fc3ef" stroke-width="2" opacity=".55" stroke-linecap="round"/>';
      }
      out += drops;
    }
    out += '</svg>';
    return out;
  }

  // ---------------- 朗读 ----------------
  var voice = null;
  function pickVoice() {
    var vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    if (!vs.length) return;
    var pref = ['Google UK English Female', 'Google UK English Male', 'Serena', 'Daniel', 'Kate', 'Sonia', 'Libby', 'Microsoft Sonia', 'Microsoft Libby'];
    for (var i = 0; i < pref.length; i++) {
      for (var j = 0; j < vs.length; j++) if (vs[j].name.indexOf(pref[i]) === 0) { voice = vs[j]; return; }
    }
    for (var k = 0; k < vs.length; k++) if (/en[-_]GB/i.test(vs[k].lang)) { voice = vs[k]; return; }
    for (var m = 0; m < vs.length; m++) if (/^en/i.test(vs[m].lang)) { voice = vs[m]; return; }
  }
  if (window.speechSynthesis) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }

  function speak(text, onWord, onEnd) {
    if (!window.speechSynthesis) { if (onEnd) onEnd(); return; }
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB';
    if (voice) u.voice = voice;
    u.rate = 0.82;
    u.pitch = 1.05;
    u.onboundary = function (e) { if (onWord) onWord(e.charIndex); };
    u.onend = function () { if (onEnd) onEnd(); };
    u.onerror = function () { if (onEnd) onEnd(); };
    speechSynthesis.speak(u);
  }

  // ---------------- 朗读识别 ----------------
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var rec = null;
  function canRecord() { return !!SR; }

  function startRec(onText, onEnd) {
    if (!SR) return false;
    try { if (rec) rec.abort(); } catch (e) {}
    rec = new SR();
    rec.lang = 'en-US';
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    var text = '';
    rec.onresult = function (e) {
      var interim = '';
      for (var i = e.resultIndex; i < e.results.length; i++) {
        var t = e.results[i][0].transcript;
        if (e.results[i].isFinal) text += ' ' + t;
        else interim += t;
      }
      onText((text + ' ' + interim).trim());
    };
    rec.onerror = function () { if (onEnd) onEnd(); };
    rec.onend = function () { if (onEnd) onEnd(); };
    rec.start();
    return true;
  }

  // ---------------- 打分 ----------------
  function normWords(s) {
    return (s || '').toLowerCase().replace(/[^a-z0-9' ]/g, ' ').split(/\s+/).filter(Boolean);
  }
  function lev(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) d[i] = [i];
    for (j = 0; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  function scoreSentence(target, said) {
    var tw = normWords(target), sw = normWords(said), hits = [], used = {};
    tw.forEach(function (w) {
      var ok = false;
      for (var i = 0; i < sw.length; i++) {
        if (used[i]) continue;
        var s = sw[i].replace(/'/g, '');
        var base = w.replace(/'/g, '').replace(/[.,!?]/g, '');
        if (s === base || (base.length >= 4 && lev(s, base) <= 1)) { ok = true; used[i] = 1; break; }
      }
      hits.push(ok);
    });
    var ratio = tw.length ? hits.filter(Boolean).length / tw.length : 0;
    return { hits: hits, ratio: ratio, stars: ratio >= 0.85 ? 3 : ratio >= 0.6 ? 2 : ratio > 0 ? 1 : 0 };
  }

  // ---------------- 渲染 ----------------
  var el = {};
  function $(id) { return document.getElementById(id); }

  function renderList() {
    state.view = 'list';
    var cats = CAT_ORDER.filter(function (c) {
      return c === '全部' || STORIES.some(function (s) { return catOf(s) === c; });
    });
    if (cats.indexOf(state.cat) < 0) state.cat = '全部';

    var chips = '';
    cats.forEach(function (c) {
      var n = c === '全部' ? STORIES.length : STORIES.filter(function (s) { return catOf(s) === c; }).length;
      chips += '<button class="st-chip' + (state.cat === c ? ' on' : '') + '" data-cat="' + c + '">' + c +
        '<i>' + n + '</i></button>';
    });

    var shown = STORIES.filter(function (s) { return state.cat === '全部' || catOf(s) === state.cat; });
    var html = '<div class="st-top"><h1>📖 绘本跟读<span class="lv">原创分级故事 · 英式朗读 · 共 ' +
      STORIES.length + ' 本</span></h1></div>' +
      '<div class="st-filters">' + chips + '</div>' +
      '<div class="st-list">';
    shown.forEach(function (s) {
      var i = STORIES.indexOf(s);
      var done = storyStars(s.id, s.pages.length);
      html += '<button class="st-card" data-story="' + i + '">' +
        '<div class="cover">' + scene(s.pages[0], true) + '</div>' +
        '<div class="meta"><b>' + s.title + '</b><span>' + s.titleZh + ' · ' + s.level + '</span>' +
        '<span style="display:block;margin-top:4px;color:#1f9d55">' + (done ? '已跟读 ' + done + '/' + s.pages.length + ' 页' : '未开始') + '</span></div>' +
        '<div class="go">›</div></button>';
    });
    if (!shown.length) html += '<p style="padding:20px;color:#7a90a0">这个分类还没有书</p>';
    html += '</div><p class="st-hintbar">先听一遍 → 点「🎤 跟读」→ 读完点「✅ 读完了」自动打分</p>';
    $('app').innerHTML = html;

    Array.prototype.forEach.call(document.querySelectorAll('.st-chip'), function (c) {
      c.addEventListener('click', function () {
        state.cat = c.dataset.cat;
        try { localStorage.setItem(LS_CAT, state.cat); } catch (e) {}
        renderList();
        window.scrollTo(0, 0);
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('.st-card'), function (b) {
      b.addEventListener('click', function () { state.story = +b.dataset.story; state.page = 0; renderReader(); });
    });
  }

  function renderReader() {
    state.view = 'reader';
    var s = STORIES[state.story], page = s.pages[state.page];
    var html = '<div class="st-top">' +
      '<button class="st-iconbtn" id="btnBack">←</button>' +
      '<h1>' + s.title + '<span class="lv">' + s.titleZh + ' · 第 ' + (state.page + 1) + '/' + s.pages.length + ' 页</span></h1>' +
      '</div>' +
      '<div class="st-art" id="art">' + scene(page) + '</div>' +
      '<div class="st-sentence" id="sent"></div>' +
      '<div class="st-zh" id="zh">' + (page.zh || '') + '</div>' +
      '<div class="st-actions">' +
      '<button class="st-btn" id="btnPlay">🔊 听一遍</button>' +
      '<button class="st-btn rec" id="btnRec">🎤 跟读</button>' +
      '<button class="st-btn primary" id="btnDone" disabled>✅ 读完了</button>' +
      '</div>' +
      '<div class="st-fb" id="fb"></div>' +
      '<div class="st-pager">' +
      '<button class="st-nav" id="btnPrev"' + (state.page === 0 ? ' disabled' : '') + '>上一页</button>' +
      '<div class="st-dots" id="dots"></div>' +
      '<button class="st-nav" id="btnNext">' + (state.page === s.pages.length - 1 ? '完成' : '下一页') + '</button>' +
      '</div>';
    $('app').innerHTML = html;

    paintSentence(page.en, []);
    paintDots();

    $('btnBack').onclick = function () { stopAll(); renderList(); };
    $('btnPlay').onclick = function () { playPage(); };
    $('btnRec').onclick = function () { beginRecord(); };
    $('btnDone').onclick = function () { finishRecord(); };
    $('btnPrev').onclick = function () { if (state.page > 0) { stopAll(); state.page--; renderReader(); } };
    $('btnNext').onclick = function () {
      stopAll();
      if (state.page < s.pages.length - 1) { state.page++; renderReader(); }
      else {
        var n = storyStars(s.id, s.pages.length);
        $('fb').innerHTML = '<span class="stars">🎉</span><span class="tip">整本读完！已跟读 ' + n + '/' + s.pages.length + ' 页</span>';
      }
    };
  }

  function paintDots() {
    var s = STORIES[state.story], prog = loadProg()[s.id] || {};
    var d = '';
    for (var i = 0; i < s.pages.length; i++) {
      var cls = 'st-dot' + (i === state.page ? ' on' : (prog[i] ? ' done' : ''));
      d += '<span class="' + cls + '"></span>';
    }
    $('dots').innerHTML = d;
  }

  function paintSentence(text, hits) {
    var words = text.split(/\s+/);
    var html = '', ti = 0;
    words.forEach(function (w, i) {
      var cls = 'w';
      if (hits && hits.length) cls += hits[i] ? ' hit' : ' miss';
      html += '<span class="' + cls + '" data-i="' + i + '">' + w + '</span> ';
      ti++;
    });
    $('sent').innerHTML = html;
  }

  function playPage() {
    var page = STORIES[state.story].pages[state.page];
    $('fb').innerHTML = '<span class="tip">正在朗读…</span>';
    var spans = document.querySelectorAll('#sent .w');
    speak(page.en, function (charIndex) {
      var text = page.en;
      var count = 0, idx = 0, pos = 0;
      for (var i = 0; i < text.length; i++) {
        if (i === charIndex) break;
        if (/\s/.test(text[i]) && i > 0 && !/\s/.test(text[i - 1])) idx++;
      }
      Array.prototype.forEach.call(spans, function (s) { s.classList.remove('said'); });
      if (spans[idx]) spans[idx].classList.add('said');
    }, function () {
      Array.prototype.forEach.call(spans, function (s) { s.classList.remove('said'); });
      if (!state.recording) $('fb').innerHTML = '';
    });
  }

  function beginRecord() {
    if (!canRecord()) {
      $('fb').innerHTML = '<span class="tip">这个浏览器不支持语音识别，建议用 Safari / Chrome / Edge。也可以只听+自己读。</span>';
      return;
    }
    if (state.recording) return;
    state.recording = true;
    state.transcript = '';
    paintSentence(STORIES[state.story].pages[state.page].en, []);
    $('btnRec').classList.add('on');
    $('btnRec').textContent = '🎤 录音中…';
    $('btnDone').disabled = false;
    $('fb').innerHTML = '<span class="tip">大声读出来吧，读完点「✅ 读完了」</span>';
    startRec(function (t) {
      state.transcript = t;
      $('fb').innerHTML = '<span class="tip">听到：' + t.slice(-40) + '</span>';
    }, function () {
      if (state.recording) { state.recording = false; }
    });
  }

  function finishRecord() {
    if (!state.recording) return;
    state.recording = false;
    try { if (rec) rec.stop(); } catch (e) {}
    $('btnRec').classList.remove('on');
    $('btnRec').textContent = '🎤 跟读';
    $('btnDone').disabled = true;
    setTimeout(evaluate, 350); // 等最后一段识别结果回来
  }

  function evaluate() {
    var s = STORIES[state.story], page = s.pages[state.page];
    var r = scoreSentence(page.en, state.transcript);
    paintSentence(page.en, r.hits);
    var stars = '';
    for (var i = 0; i < 3; i++) stars += i < r.stars ? '⭐' : '☆';
    var tips = ['再听一遍，慢慢读一次', '不错，注意漏掉的词', '很好！发音很稳', '太棒了，满分跟读！'];
    $('fb').innerHTML = '<span class="stars">' + stars + '</span>' +
      '<span class="tip">' + tips[r.stars] + '（' + Math.round(r.ratio * 100) + '%）</span>';
    if (r.stars > 0) { setStars(s.id, state.page, r.stars); paintDots(); }
  }

  function stopAll() {
    state.recording = false;
    try { if (rec) rec.stop(); } catch (e) {}
    if (window.speechSynthesis) speechSynthesis.cancel();
  }

  // ---------------- 启动 ----------------
  document.addEventListener('DOMContentLoaded', function () {
    if (!STORIES.length) { $('app').innerHTML = '<p style="padding:20px">素材未加载</p>'; return; }
    try { var c = localStorage.getItem(LS_CAT); if (c) state.cat = c; } catch (e) {}
    renderList();
  });
  window.StoryBook = { renderList: renderList, scene: scene };
})();
