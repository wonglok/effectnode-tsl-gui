import { ISheet } from '@theatre/core'
import { getHomeProject } from '../Theatre/HomeProject'
import { useEffect, useState } from 'react'

export const FlyPlaneSheetName = 'FlyPlaneSheet'

export const useSheetHome = (name: string): ISheet | false => {
  let [sheet, setSheet] = useState<ISheet | false>(false)

  useEffect(() => {
    getHomeProject().then((project) => {
      setSheet(project.sheet(name))
    })
  }, [])

  return sheet
}
