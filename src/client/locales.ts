/** `muyu` namespace dictionaries. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'muyu'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'fish.aria': '赛博木鱼：点击敲击，可拖拽',
  'count': '功德 + {count}',
  'settings.title': '设置',
  'color.custom': '自定义颜色',
  'color.random': '随机颜色',
  'reset': '重置计数',
  'rainbow.burst': '七彩！',
  'color.shift': '变色！',
  'strike.plus': '+1',
  'strike.crit': '+{gain} 暴击！',
  'fortune': '+{gain} 暴富！',
  'bubble.0': '慢一点嘛，木鱼都要冒烟啦~',
  'bubble.1': '这么快，功德没跟上呢_(´ཀ`」 ∠)_',
  'bubble.2': '手速过快，功德溢出……',
  'bubble.3': '再快它就要唱rap了，冷静！',
  'bubble.4': '您的手速已超越全国99%的人，请减速慢敲～',
  'bubble.5': '施主，欲速则不达～',
  'bubble.6': '木鱼头晕了，让鱼缓缓……',
  'bubble.7': '检测到手速异常，功德源已限流',
  'bubble.8': '这么急，是老板来了吗？',
  'bubble.9': '心静自然凉，手慢功德多',
  'bubble.10': '手速惊人，可惜这里不是音游',
  'bubble.11': '先喝口水，功德跑不掉～',
} as const

/** English dictionary, key-identical to the Chinese source of truth. */
export const en: Record<MuyuKey, string> = {
  'fish.aria': 'Cyber wooden fish: click to strike, draggable',
  'count': 'Merit + {count}',
  'settings.title': 'Settings',
  'color.custom': 'Custom color',
  'color.random': 'Random color',
  'reset': 'Reset count',
  'rainbow.burst': 'Rainbow!',
  'color.shift': 'Color shift!',
  'strike.plus': '+1',
  'strike.crit': '+{gain} crit!',
  'fortune': '+{gain} Fortune!',
  'bubble.0': 'Take it easy, the fish is about to smoke~',
  'bubble.1': 'So fast the merit can\'t keep up_(´ཀ`」 ∠)_',
  'bubble.2': 'Too fast, merit is overflowing...',
  'bubble.3': 'Any faster and it\'ll start rapping, chill!',
  'bubble.4': 'Your APM beats 99% of the country, slow down~',
  'bubble.5': 'Haste makes waste, dear patron~',
  'bubble.6': 'The fish is dizzy — give it a sec...',
  'bubble.7': 'Tap rate abnormal — merit throttled',
  'bubble.8': 'Why the rush — is the boss behind you?',
  'bubble.9': 'A calm mind, a slow hand, more merit',
  'bubble.10': "Amazing APM — but this isn't a rhythm game",
  'bubble.11': "Take a sip — the merit isn't going anywhere~",
}

/** Key domain of the `muyu` namespace (zh is the source of truth). */
export type MuyuKey = keyof typeof zh
