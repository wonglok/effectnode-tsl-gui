import { ISheet } from '@theatre/core'
import { getHomeProject } from '../Theatre/HomeProject'
import { useEffect, useState } from 'react'

export const FlyPlaneSheetName = 'FlyPlaneSheet'

export const getFlyPlaneSheet = async () => {
  let project = await getHomeProject()

  return project.sheet(FlyPlaneSheetName)
}

export const useSheetHome = (): ISheet | false => {
  let [sheet, setSheet] = useState<ISheet | false>(false)

  useEffect(() => {
    getFlyPlaneSheet().then((sh) => {
      setSheet(sh)
    })
  }, [])

  return sheet
}
