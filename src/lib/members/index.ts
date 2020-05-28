import { NogiMembers } from "./nogi"
import { KeyakiMembers } from "./keyaki"
import { HinataMembers } from "./hinata"

export interface Member {
  group:string,
  id:string|number
  generation:number
  name:string
  nameSpaced:string
  nameEnglish:string
  officialBlogMemberID?:string
}

const members:Member[] = [
  ...NogiMembers,
  ...KeyakiMembers,
  ...HinataMembers
]

export function getMember(group:string, memberID:string):Member|undefined {
  
  for (let i = 0; i < members.length; i++) {

    if (members[i].group == group && members[i].id == memberID) {
      return members[i]
    }
  }
  return undefined
}

export function getMembers(group:string):Member[] {
  return members.filter(member => member.group === group)
}

export function getGenerations(group:string):{ generation:number, members:Member[] }[]|undefined {

  let generations:number[] = []
  let membersByGeneration:{ generation:number, members:Member[] }[] = []

  for (let i = 0; i < members.length; i++) {

    const member = members[i]

    if (member.group !== group) {
      continue
    }

    const generation = member.generation

    if (generations.includes(member.generation) === false) {

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