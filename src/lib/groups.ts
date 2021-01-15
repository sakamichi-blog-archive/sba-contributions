interface Group {
  key:string,
  name:string,
  english:string,
  englishShort:string
}
export const groups:Group[] = [
  {
    key: "nogi",
    name: "乃木坂46",
    english: "Nogizaka46",
    englishShort: "Nogi"
  },
  {
    key: "keyaki",
    name: "日向坂46",
    english: "Keyakizaka46",
    englishShort: "Keyaki"
  },
  {
    key: "hinata",
    name: "日向坂46",
    english: "Hinatazaka46",
    englishShort: "Hinata"
  },
  {
    key: "sakura",
    name: "櫻坂46",
    english: "Sakurazaka46",
    englishShort: "Sakura"
  }
]

export function getGroup(group:string):Group|undefined {
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].key == group) {
      return groups[i]
    }
  }
  return undefined
}