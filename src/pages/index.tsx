import Head from "next/head"
import { GetStaticProps } from "next"
import { getYears } from "../lib/years"
import { getGroup } from "../lib/groups"
import Link from "next/link"

export default function Index({
  years
}: {
  years: {
    key:string,
    years:number[]
  }[]
}) {
  return (
    <>
      <Head>
        <title>Blog Contributions</title>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&amp;display=swap" rel="stylesheet" key="google-fonts" />
      </Head>
      <div className="index">
        <ul className="index__groups">
        { years.map(({ key, years }) => (
          <li className="index__groups__group" key={ key }>
            <h2>{ getGroup(key).englishShort }</h2>
            <ul className="index__groups__group__years">
            { years.map(year => (
              <li className="index__groups__group__years__year" key={ year }>
                <Link href="/[group]/[year]" as={ `/${ key }/${ year }` }>
                  <a title={ `${ getGroup(key).englishShort } ${ year }` }>{ year }</a>
                </Link>
              </li>
            ))}
            </ul>
          </li>
        ))}
        </ul>
      </div>
    </>
  )
}

export const getStaticProps:GetStaticProps = async () => {

  const data = getYears()

  return {
    props: {
      years: data
    }
  }
}