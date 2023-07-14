import { NOGI_MEMBERS } from "./nogi"
import { KEYAKI_MEMBERS } from "./keyaki"
import { HINATA_MEMBERS } from "./hinata"
import { SAKURA_MEMBERS } from "./sakura"

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
  ...NOGI_MEMBERS,
  ...KEYAKI_MEMBERS,
  ...HINATA_MEMBERS,
  ...SAKURA_MEMBERS
]

export function getMember(group: string, id: string): Member | undefined {
  return members.find(member => member.group === group && member.id == id)
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
