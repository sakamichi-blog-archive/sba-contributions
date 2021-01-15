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
  members:string[]
  count:number
}
export interface MonthData {
  name:string
  weekIndex:number
}

const dataDirectory = path.join(process.cwd(), "data")

export function getYears() {

  return groups.filter(group => {
    const groupDirectory = path.join(dataDirectory, group.key)
    return fs.existsSync(groupDirectory)
  }).map(group => {
    const groupKey = group.key
    const groupDirectory = path.join(dataDirectory, groupKey)
    const fileNames = fs.readdirSync(groupDirectory)

    const years = fileNames.filter(fileName => {

      if (fileName.match(/^\d+\.json$/i) === null) {
        return false
      }

      const absolutePath = path.join(groupDirectory, fileName)

      return (fs.statSync(absolutePath).isDirectory() === false)
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