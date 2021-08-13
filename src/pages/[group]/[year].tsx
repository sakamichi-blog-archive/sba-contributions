import { GetStaticProps, GetStaticPaths } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { ChangeEvent, useState } from "react"

import { getYearParams, getYearData, YearData, DayData } from "../../lib/years"
import { getGroup } from "../../lib/groups"
import { getMember, getGenerations } from "../../lib/members"
import { BLOG_COUNT_STEP } from "../../lib/constants"

export default function Year({ yearData }: { yearData: YearData }) {
  const router = useRouter()
  const { group, year, id } = router.query

  const groupData = getGroup(group as string)

  const memberData = id !== undefined
    ? getMember(group as string, id as string)
    : undefined
  const memberName = id !== undefined ? memberData.nameEnglish : undefined

  let count = yearData.count
  let segments = yearData.segments
  if (id !== undefined) {
    count = 0
    for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex++) {
      segments[segmentIndex].days = segments[segmentIndex].days.map(day => {
        const newCount = day.members.filter(i => i === id).length
        count += newCount
        return {
          ...day,
          count: newCount
        }
      })
    }
  }

  function getClassName(count: number): string {
    return count >= BLOG_COUNT_STEP * 3 + 1
      ? "level-5"
      : `level-${ Math.ceil(count / BLOG_COUNT_STEP) + 1 }`
  }

  const [ activeSquare, setActiveSquare ] = useState("")
  function handleActiveSquare(date:string): void {
    setActiveSquare(date)
  }

  function getOfficialLink(day: DayData): string | undefined {
    let link: string | undefined
    const dateEightDigit = day.date.replace(/-/g, "")
    const date = new Date()
    const ima = String(date.getHours()).padStart(2, "0") + String(date.getMinutes()).padStart(2, "0")
    switch (group) {
      case "nogi": {
        link = `https://www.nogizaka46.com/s/n46/diary/MEMBER/list?ima=${ ima }`
        break
      }
      case "keyaki": {
        link = "https://www.keyakizaka46.com/s/k46o/diary/member/list?ima=0000"
        break
      }
      case "hinata": {
        link = "https://www.hinatazaka46.com/s/official/diary/member/list?ima=0000"
        break
      }
      case "sakura": {
        link = `https://sakurazaka46.com/s/s46/diary/blog/list?ima=${ ima }`
        break
      }
      default: {
        return
      }
    }
    if (memberData?.idOfficial) {
      link += `&ct=${ memberData.idOfficial }`
    } else if (memberData?.id) {
      link += `&ct=${ memberData.id }`
    }
    return link + `&dy=${ dateEightDigit }`
  }
  function getDateFormatted(date: string): string {
    const dateObject = new Date(date)
    return `${ dateObject.getMonth() + 1 }/${ dateObject.getDate() }`
  }

  const generations = getGenerations(group as string)
  const members = [].concat(...generations.map(generation => generation.members))

  function filterByMember(event: ChangeEvent<HTMLSelectElement>): void {
    if (event.target.value == "-1") {
      router.push(
        `/[group]/[year]`,
        `/${ group }/${ year }`
      )
      return
    }
    const member = members[Number(event.target.value)]
    router.push(
      `/[group]/[year]?id=${ member.id }`,
      `/${ group }/${ year }?id=${ member.id }`
    )
  }

  const pluralRules = new Intl.PluralRules("en", { type: "ordinal" })
  const numberSuffixes = {
    one: "st",
    two: "nd",
    few: "rd",
    other: "th"
  }
  function getNumberSuffix(number:number):string {
    return numberSuffixes[pluralRules.select(number)]
  }

  return (
    <>
      <Head>
        <title>{ `${ memberName || groupData.englishShort } ${ year } Blog Contributions` }</title>
      </Head>
      <div className="year">
        <h1 className="year__title">
          { memberName || groupData.englishShort } { year } <span>{ count } contribution{ count !== 1 ? "s" : "" }{
            count > 1 && (
              <> ({ Math.round(count * 10 / yearData.days.length) / 10 } per day)</>
            )
          }</span>
        </h1>
        <div className="year__contributions">
        { segments.map((segment, segmentIndex) => (
          <div className="year__contributions__segment" key={ segmentIndex }>
            <ul className="year__contributions__segment__months">
            { segment.months.map((month, i) => (
              <li
                style={{
                  gridColumn: `${ month.weekIndex + 1 }`
                }}
                key={ i }>
                { month.name }
              </li>
            ))}
            </ul>
            <ul className="year__contributions__segment__days">
              <li>Sun</li>
              <li>Mon</li>
              <li>Tue</li>
              <li>Wed</li>
              <li>Thu</li>
              <li>Fri</li>
              <li>Sat</li>
            </ul>
            <ul className="year__contributions__segment__squares">
            { segment.days.map((day, dayIndex) => (
              <li
                className={
                  getClassName(day.count) + " "
                  + (activeSquare === day.date ? "focused" : "")
                }
                style={{ gridRowStart: dayIndex === 0 ? segment.offset + 1 : 0 }}
                key={ day.date }
                onClick={ () => handleActiveSquare(day.date) }
              >
                { day.count }
              { day.count > 0 && (
                <a className="link" href={ getOfficialLink(day) } target="_blank" rel="noopener noreferrer">
                  { memberName || groupData.englishShort } { getDateFormatted(day.date) }
                </a>
              ) }
                <span>
                  { getDateFormatted(day.date) }: { day.count } post{ day.count === 1 ? "" : "s" }
                </span>
              </li>
            ))}
            </ul>
          </div>
        ))}
          <div className="year__contributions__legend">
            <ul className="colors">
            { [1, 2, 3, 4, 5].map(n => (
              <li key={ n }>
                <span className={ `square level-${ n }` }></span>
              {
                function() {
                  if (n === 1) {
                    return (
                      <span>0</span>
                    )
                  } else if (n === 5)  {
                    return (
                      <span>10-</span>
                    )
                  } else {
                    return (
                      <span>{ (n - 2) * BLOG_COUNT_STEP + 1 }-{ (n - 1) * BLOG_COUNT_STEP }</span>
                    )
                  }
                }()
              }
              </li>
            ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="member-filter">
        <select
          onChange={ filterByMember }
        >
          <option value="-1">Filter by member</option>
        { generations.map(generation => (
          <optgroup
            label={ `${ generation.generation + getNumberSuffix(generation.generation) } generation` }
            key={ generation.generation }
          >
          { generation.members.map(member => (
            <option key={ member.id } value={ members.indexOf(member) }>
              { member.nameEnglish }
            </option>
          ))}
          </optgroup>
        ))}
        </select>
      </div>
      <Link href="/">
        <a className="back-home">← Back home</a>
      </Link>
    </>
  )
}

export const getStaticPaths:GetStaticPaths = async () => {
  
  const paths = getYearParams()
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps:GetStaticProps = async ({ params }) => {

  const yearData = await getYearData(params.group as string, params.year as string)
  return {
    props: {
      yearData
    }
  }
}