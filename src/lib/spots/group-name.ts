/**
 * グループ名の文字種ルール:
 * - 英数字・半角記号 → 半角
 * - ひらがな・カタカナ・漢字 → 全角
 */

const FULLWIDTH_ALNUM_START = 0xff10; // ０
const FULLWIDTH_ALNUM_END = 0xff5a; // ｚ
const HALFWIDTH_KATAKANA_START = 0xff61; // ｡
const HALFWIDTH_KATAKANA_END = 0xff9f; // ﾟ

/** 全角英数字・記号 → 半角 */
function toHalfWidthAscii(char: string) {
  const code = char.charCodeAt(0);
  if (code >= 0xff01 && code <= 0xff5e) {
    return String.fromCharCode(code - 0xfee0);
  }
  if (char === "\u3000") return " ";
  return char;
}

/** 半角カタカナ → 全角カタカナ（簡易） */
const HALFWIDTH_KATAKANA_MAP: Record<string, string> = {
  ｱ: "ア",
  ｲ: "イ",
  ｳ: "ウ",
  ｴ: "エ",
  ｵ: "オ",
  ｶ: "カ",
  ｷ: "キ",
  ｸ: "ク",
  ｹ: "ケ",
  ｺ: "コ",
  ｻ: "サ",
  ｼ: "シ",
  ｽ: "ス",
  ｾ: "セ",
  ｿ: "ソ",
  ﾀ: "タ",
  ﾁ: "チ",
  ﾂ: "ツ",
  ﾃ: "テ",
  ﾄ: "ト",
  ﾅ: "ナ",
  ﾆ: "ニ",
  ﾇ: "ヌ",
  ﾈ: "ネ",
  ﾉ: "ノ",
  ﾊ: "ハ",
  ﾋ: "ヒ",
  ﾌ: "フ",
  ﾍ: "ヘ",
  ﾎ: "ホ",
  ﾏ: "マ",
  ﾐ: "ミ",
  ﾑ: "ム",
  ﾒ: "メ",
  ﾓ: "モ",
  ﾔ: "ヤ",
  ﾕ: "ユ",
  ﾖ: "ヨ",
  ﾗ: "ラ",
  ﾘ: "リ",
  ﾙ: "ル",
  ﾚ: "レ",
  ﾛ: "ロ",
  ﾜ: "ワ",
  ｦ: "ヲ",
  ﾝ: "ン",
  ｧ: "ァ",
  ｨ: "ィ",
  ｩ: "ゥ",
  ｪ: "ェ",
  ｫ: "ォ",
  ｬ: "ャ",
  ｭ: "ュ",
  ｮ: "ョ",
  ｯ: "ッ",
  ｰ: "ー",
  "｡": "。",
  "｢": "「",
  "｣": "」",
  "､": "、",
  "･": "・",
};

const DAKUTEN_MAP: Record<string, string> = {
  カ: "ガ",
  キ: "ギ",
  ク: "グ",
  ケ: "ゲ",
  コ: "ゴ",
  サ: "ザ",
  シ: "ジ",
  ス: "ズ",
  セ: "ゼ",
  ソ: "ゾ",
  タ: "ダ",
  チ: "ヂ",
  ツ: "ヅ",
  テ: "デ",
  ト: "ド",
  ハ: "バ",
  ヒ: "ビ",
  フ: "ブ",
  ヘ: "ベ",
  ホ: "ボ",
  ウ: "ヴ",
};

const HANDAKUTEN_MAP: Record<string, string> = {
  ハ: "パ",
  ヒ: "ピ",
  フ: "プ",
  ヘ: "ペ",
  ホ: "ポ",
};

export function normalizeGroupName(value: string) {
  let result = "";

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i]!;
    const next = value[i + 1];

    if (char in HALFWIDTH_KATAKANA_MAP) {
      const base = HALFWIDTH_KATAKANA_MAP[char]!;
      if (next === "ﾞ" && base in DAKUTEN_MAP) {
        result += DAKUTEN_MAP[base];
        i += 1;
        continue;
      }
      if (next === "ﾟ" && base in HANDAKUTEN_MAP) {
        result += HANDAKUTEN_MAP[base];
        i += 1;
        continue;
      }
      result += base;
      continue;
    }

    result += toHalfWidthAscii(char);
  }

  return result.trim();
}

export function validateGroupName(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return "グループ名を入力してください";
  }

  for (const char of trimmed) {
    const code = char.charCodeAt(0);

    // 全角英数字・全角記号は不可（正規化前チェック用）
    if (
      (code >= FULLWIDTH_ALNUM_START && code <= FULLWIDTH_ALNUM_END) ||
      (code >= 0xff01 && code <= 0xff0f) ||
      (code >= 0xff3b && code <= 0xff40) ||
      (code >= 0xff5b && code <= 0xff5e)
    ) {
      return "英数字・記号は半角で入力してください";
    }

    // 半角カタカナは不可
    if (code >= HALFWIDTH_KATAKANA_START && code <= HALFWIDTH_KATAKANA_END) {
      return "かな・漢字は全角で入力してください";
    }
  }

  return null;
}

export function isValidGroupName(value: string) {
  return validateGroupName(normalizeGroupName(value)) === null;
}
