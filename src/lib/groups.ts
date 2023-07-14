interface Group {
  english: string
  englishShort: string
  key: string
  name: string
}
export const groups: Group[] = [
  {
    english: "Nogizaka46",
    englishShort: "Nogi",
    key: "nogi",
    name: "乃木坂46"
  },
  {
    english: "Keyakizaka46",
    englishShort: "Keyaki",
    key: "keyaki",
    name: "欅坂46"
  },
  {
    english: "Hinatazaka46",
    englishShort: "Hinata",
    key: "hinata",
    name: "日向坂46"
  },
  {
    english: "Sakurazaka46",
    englishShort: "Sakura",
    key: "sakura",
    name: "櫻坂46"
  }
]

export function getGroup(group: string): Group | undefined {
  return groups.find(_group => _group.key === group)
}
