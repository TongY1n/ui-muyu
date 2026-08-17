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
}

/** Key domain of the `muyu` namespace (zh is the source of truth). */
export type MuyuKey = keyof typeof zh
