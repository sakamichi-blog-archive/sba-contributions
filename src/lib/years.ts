import fs from "fs"
import path from "path"
import { groups } from "./groups"

export interface YearData {
  year:number
  count:number
  days:DayData[]
  offset:number
  weekCount:number
  months:MonthData[]
  [key:string]:any
}
export interface DayData {
  date:string
  dateFormatted:string
  count:number
}
export interface MonthData {
  name:string
  width:number
  weekIndex:number
}

const dataDirectory = path.join(process.cwd(), "data")

export function getYears() {

  return groups.map(group => {

    const groupKey = group.key

    const groupDirectory = path.join(dataDirectory, groupKey)

    const fileNames = fs.readdirSync(groupDirectory)

    const years = fileNames.filter(fileName => {

      const absolutePath = path.join(groupDirectory, fileName)

      if (fs.statSync(absolutePath).isDirectory()) {
        return false
      }
      return true
    })
    .map(fileName => {

      return Number(path.basename(fileName, ".json"))

    }).sort((a, b) => {
      
      return - (a - b)
    })

    return {
      key: groupKey,
      years
    }
  })
}

export function getYearData(group:string, year: Number|string):YearData {

  const jsonPath = path.join(dataDirectory, group, `${ year }.json`)
  const content = fs.readFileSync(jsonPath, "utf8")

  const json = JSON.parse(content)

  return json as YearData
}

export function getYearParams() {

  let dynamicParams = []

  getYears().forEach(group => {

    group.years.forEach(year => {
      dynamicParams.push({
        params: {
          group: group.key,
          year: `${ year }`
        }
      })
    })
  })

  return dynamicParams
}