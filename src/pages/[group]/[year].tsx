import Head from "next/head"
import { useRouter } from "next/router"
import { GetStaticProps, GetStaticPaths } from "next"
import Link from "next/link"
import { getYearParams, getYearData, YearData, DayData } from "../../lib/years"
import { getGroup } from "../../lib/groups"
import { BLOG_COUNT_STEP } from "../../lib/constants"

export default function Year({ yearData }: { yearData:YearData }) {

  const router = useRouter()
  const { group, year } = router.query

  const groupData = getGroup(group as string)

  function getClassName(count:number):string {

    if (count >= BLOG_COUNT_STEP * 3 + 1) {
      return "level-5"
    }
    return `level-${ Math.ceil(count / BLOG_COUNT_STEP) + 1 }`
  }
  function getColumnStart(day:DayData) {

    if (day.date.match(/01-01$/iu) === null) {
      return
    }
    return yearData.offset + 1
  }
  // const [ activeSquares, setActiveSquares ] = useState([])

  // function handleActiveSquare(date:string) {

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

  return (
    <>
      <Head>
        <title>{ `${ groupData.englishShort } ${ year } Contributions` }</title>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&amp;display=swap" rel="stylesheet" key="google-fonts" />
      </Head>
      <div className="year">
        <h1 className="year__title">
          { groupData.englishShort } { year } <span>{ yearData.count } contributions</span>
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
          { yearData.days.map(day => (
            <li
              className={
                getClassName(day.count) + " "
                // + (activeSquares.includes(day.date) ? "focused" : "")
              }
              style={{ gridRowStart: getColumnStart(day) }}
              key={ day.date }
              // onClick={ () => handleActiveSquare(day.date) }
            >
              { day.count }
              <span>
                { day.dateFormatted }: { day.count } post{ day.count === 1 ? "" : "s" }
              </span>
            </li>
          ))}
          </ul>
          <div className="legend">
            {/* <p>Less</p> */}
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
            {/* <p>More</p> */}
          </div>
        </div>
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