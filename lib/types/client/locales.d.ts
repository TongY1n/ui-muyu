/** `muyu` namespace dictionaries. */
/** Dictionary namespace owned by this plugin. */
export declare const NS = "muyu";
/** Simplified Chinese dictionary (the key-set source of truth). */
export declare const zh: {
    readonly 'fish.aria': "赛博木鱼：点击敲击，可拖拽";
    readonly count: "功德 + {count}";
    readonly 'settings.title': "设置";
    readonly 'color.custom': "自定义颜色";
    readonly 'color.random': "随机颜色";
    readonly reset: "重置计数";
    readonly 'rainbow.burst': "七彩！";
    readonly 'color.shift': "变色！";
    readonly 'strike.plus': "+1";
    readonly 'strike.crit': "+{gain} 暴击！";
    readonly fortune: "+{gain} 暴富！";
    readonly 'bubble.0': "慢一点嘛，木鱼都要冒烟啦~";
    readonly 'bubble.1': "这么快，功德没跟上呢_(´ཀ`」 ∠)_";
    readonly 'bubble.2': "手速过快，功德溢出……";
    readonly 'bubble.3': "再快它就要唱rap了，冷静！";
    readonly 'bubble.4': "您的手速已超越全国99%的人，请减速慢敲～";
};
/** English dictionary, key-identical to the Chinese source of truth. */
export declare const en: Record<MuyuKey, string>;
/** Key domain of the `muyu` namespace (zh is the source of truth). */
export type MuyuKey = keyof typeof zh;
