import { NogiMembers } from "./nogi"
import { KeyakiMembers } from "./keyaki"
import { HinataMembers } from "./hinata"
import { SakuraMembers } from "./sakura"

export interface Member {
  generation: number
  group: string
  id: string | number
  idOfficial?: string
  name: string
  nameEnglish: string
  nameSpaced: string
}

const members: Member[] = [
  ...NogiMembers,
  ...KeyakiMembers,
  ...HinataMembers,
  ...SakuraMembers
]

export function getMember(group: string, id: string): Member | undefined {
  for (let i = 0; i < members.length; i++) {
    const member = members[i]
    if (member.group == group && member.id == id) {
      return member
    }
  }
}

export function getMembers(group: string): Member[] {
  return members.filter(member => member.group === group)
}

export function getGenerations(group: string): { generation: number, members: Member[] }[] | undefined {
  const generations: number[] = []
  const membersByGeneration: { generation: number, members: Member[] }[] = []

  for (let i = 0; i < members.length; i++) {
    const member = members[i]
    if (member.group !== group) {
      continue
    }

    const generation = member.generation
    if (!generations.includes(member.generation)) {
      generations.push(member.generation)
      membersByGeneration.push({
        generation,
        members: []
      })
    }
    const index = generations.indexOf(member.generation)
    membersByGeneration[index].members.push(member)
  }
  return membersByGeneration
}
