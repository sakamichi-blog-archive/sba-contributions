import dayjs from "dayjs"
import fs from "fs"
import path from "path"
import { groups } from "./groups"

export interface YearDataJson {
  count: number
  days: DayData[]
  months: MonthData[]
  offset: number
  weekCount: number
  year: number
}
export interface YearData {
  count: number
  days: DayData[]
  segments: {
    days: DayData[]
    months: MonthData[]
    offset: number
  }[]
  weekCount: number
  year: number
}
export interface DayData {
  count: number
  date: string
  members: string[]
}
export interface MonthData {
  name: string
  weekIndex: number
}

const dataDirectory = path.join(process.cwd(), "data")

export interface GroupYears {
  key: string
  years: number[]
}

export function getGroupYears(): GroupYears[] {
  return groups.filter(group => {
    const groupDirectory = path.join(dataDirectory, group.key)
    return fs.existsSync(groupDirectory)
  }).map(group => {
    const groupKey = group.key
    const groupDirectory = path.join(dataDirectory, groupKey)

    const years = fs.readdirSync(groupDirectory)
    .filter(fileName => {
      if (fileName.match(/^\d+\.json$/i) === null) {
        return false
      }
      const absolutePath = path.join(groupDirectory, fileName)
      return !fs.statSync(absolutePath).isDirectory()
    })
    .map(fileName => Number(path.basename(fileName, ".json")))
    .sort((a, b) => - (a - b))

    return {
      key: groupKey,
      years
    }
  })
}

export function getYearData(group: string, year: number | string): YearData {
  const jsonPath = path.join(dataDirectory, group, `${ year }.json`)
  const content = fs.readFileSync(jsonPath, "utf8")
  const json = JSON.parse(content) as YearDataJson
  if (json.weekCount <= 26) {
    return {
      ...json,
      segments: [
        {
          days: json.days,
          months: json.months,
          offset: json.offset
        }
      ]
    }
  }

  const segments: { days: DayData[], months: MonthData[], offset: number }[] = []
  const dayFirst = json.days[0]
  const maxWeeks = json.months.length !== 12 ? Math.round((json.offset + json.days.length - 4) / 7 / 2) : 24
  for (
    let dayIndex = 0, segmentIndex = 0, weekIndex = 0;
    dayIndex < json.days.length;
    dayIndex++
  ) {
    const day = json.days[dayIndex]
    if (day.date !== dayFirst.date) {
      if (dayjs(day.date).day() === 0) {
        weekIndex++
      }
      if (weekIndex > maxWeeks && dayjs(day.date).date() === 1) {
        segmentIndex++
        weekIndex = 0
      }
    }
    if (segments[segmentIndex] === undefined) {
      segments.push({
        days: [day],
        months: [{
          name: dayjs(day.date).format("MMM"),
          weekIndex
        }],
        offset: dayjs(day.date).day()
      })
    } else {
      segments[segmentIndex].days.push(day)
      if (dayjs(day.date).date() === 1) {
        if (
          segments[segmentIndex].months.find(month => month.weekIndex === weekIndex)
          !== undefined
        ) {
          segments[segmentIndex].months.pop()
        }
        segments[segmentIndex].months.push({
          name: dayjs(day.date).format("MMM"),
          weekIndex
        })
      }
    }
  }
  return {
    ...json,
    segments
  }
}
