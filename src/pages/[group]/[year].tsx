import Head from "next/head"
import { useRouter } from "next/router"
import { GetStaticProps, GetStaticPaths } from "next"
import Link from "next/link"
import { getYearParams, getYearData, YearData, DayData } from "../../lib/years"
import { getGroup } from "../../lib/groups"
import { getMember, getGenerations } from "../../lib/members"
import { BLOG_COUNT_STEP } from "../../lib/constants"
import { ChangeEvent, useState } from "react"

export default function Year({ yearData }: { yearData:YearData }) {

  const router = useRouter()
  const { group, year, id } = router.query

  const groupData = getGroup(group as string)

  const memberData = id !== undefined ? getMember(group as string, id as string) : undefined
  const memberName = id !== undefined ? memberData.nameEnglish : undefined

  let days = yearData.days
  let count = yearData.count

  if (id !== undefined) {
    
    count = 0

    days = yearData.days.map(day => {

      const newCount = day.members.filter(i => i === `${ id }`).length
      count += newCount

      return {
        ...day,
        count: newCount
      }
    })
  }

  function getClassName(count:number):string {

    if (count >= BLOG_COUNT_STEP * 3 + 1) {
      return "level-5"
    }
    return `level-${ Math.ceil(count / BLOG_COUNT_STEP) + 1 }`
  }
  function getColumnStart(day:DayData):number|undefined {

    if (days.indexOf(day) !== 0) {
      return undefined
    }
    return yearData.offset + 1
  }
  const [ activeSquare, setActiveSquare ] = useState("")
  function handleActiveSquare(date:string):void {
    setActiveSquare(date)
  }

  // const [ activeSquares, setActiveSquares ] = useState([])

  // function handleActiveSquares(date:string) {

  //   let newActiveSquares = [...activeSquares]

  //   if (activeSquares.includes(date)) {

  //     const dateIndex = newActiveSquares.indexOf(date)
  //     newActiveSquares.splice(dateIndex, 1)
  //     setActiveSquares(newActiveSquares)

  //   } else {

  //     newActiveSquares.push(date)
  //     setActiveSquares(newActiveSquares)
  //   }
  // }

  function getOfficialLink(day:DayData):string|undefined {

    let link:string|undefined
    const dateEightDigit = day.date.replace(/-/g, "")
    if (group === "nogi") {
      if (memberName) {
        link = `http://blog.nogizaka46.com/${ memberData.officialBlogMemberID }/?d=${ dateEightDigit }`
      } else {
        link = `http://blog.nogizaka46.com/?d=${ dateEightDigit }`
      }
    } else if (group === "keyaki") {
      if (memberName) {
        link = `https://www.keyakizaka46.com/s/k46o/diary/member/list?ima=0000&ct=${ memberData.id }&dy=${ dateEightDigit }`
      } else {
        link = `https://www.keyakizaka46.com/s/k46o/diary/member/list?ima=0000&dy=${ dateEightDigit }`
      }
    } else if (group === "hinata") {
      if (memberName) {
        link = `https://www.hinatazaka46.com/s/official/diary/member/list?ima=0000&ct=${ memberData.id }&dy=${ dateEightDigit }`
      } else {
        link = `https://www.hinatazaka46.com/s/official/diary/member/list?ima=0000&dy=${ dateEightDigit }`
      }
    } else if (group === "sakura") {
      const date = new Date()
      const ima = ("0" + date.getHours()).substr(-2) + ("0" + date.getMinutes()).substr(-2)
      if (memberName) {
        link = `https://sakurazaka46.com/s/s46/diary/blog/list?ima=${ ima }&ct=${ memberData.id }&dy=${ dateEightDigit }`
      } else {
        link = `https://sakurazaka46.com/s/s46/diary/blog/list?ima=${ ima }&dy=${ dateEightDigit }`
      }
    }
    return link
  }
  function getDateFormatted(date:string):string {
    const dateObject = new Date(date)
    return `${ dateObject.getMonth() + 1 }/${ dateObject.getDate() }`
  }

  const generations = getGenerations(group as string)

  const members = [].concat(...generations.map(generation => generation.members))

  function filterByMember(event:ChangeEvent<HTMLSelectElement>):void {

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
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&amp;display=swap" rel="stylesheet" key="google-fonts" />
      </Head>
      <div className="year">
        <h1 className="year__title">
          { memberName || groupData.englishShort } { year } <span>{ count } contribution{ count !== 1 ? "s" : "" }</span>
        </h1>
        <div className="contributions-chart grid">
          <ul className="months grid-child">
          { yearData.months.map((month, i) => (
            <li
              style={{
                gridColumn: `${ month.weekIndex + 1 }`
              }}
              key={ i }>
              { month.name }
            </li>
          ))}
          </ul>
          <ul className="days grid-child">
            <li>Sun</li>
            <li>Mon</li>
            <li>Tue</li>
            <li>Wed</li>
            <li>Thu</li>
            <li>Fri</li>
            <li>Sat</li>
          </ul>
          <ul className="squares grid-child">
          { days.map(day => (
            <li
              className={
                getClassName(day.count) + " "
                + (activeSquare === day.date ? "focused" : "")
              }
              style={{ gridRowStart: getColumnStart(day) }}
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
          <div className="legend">
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