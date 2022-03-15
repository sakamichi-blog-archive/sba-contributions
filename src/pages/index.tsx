import { GetStaticProps } from "next"
import Head from "next/head"
import Link from "next/link"

import { getGroup } from "../lib/groups"
import { getGroupYears, GroupYears } from "../lib/years"

interface IndexPageProps {
  groups: GroupYears[]
}
export default function Index({ groups }: IndexPageProps) {
  return (
    <>
      <Head>
        <title>Blog Contributions</title>
      </Head>
      <div className="index">
        <ul className="index__groups">
        { groups.map(({ key, years }) => (
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

export const getStaticProps: GetStaticProps<IndexPageProps> = function () {
  return {
    props: {
      groups: getGroupYears()
    }
  }
}
