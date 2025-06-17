import { getProject } from '@theatre/core'
import { ISheet } from '@theatre/core'
import { useEffect, useState } from 'react'

export const HomeProjectName = 'HomeProject'

export const getHomeProject = async () => {
  const config: any = {
    state: false,
  }
  if (process.env.NODE_ENV === 'development') {
    // config.state = state001
    config.state = await fetch(`/states/current/state.json`).then((r) => r.json())
  } else {
    //
    let data = require('../../../public/states/current/state.json')
    config.state = data
  }

  const project = getProject(HomeProjectName, config)

  return project
}

export const useSheetData = (name: string): ISheet | false => {
  let [sheet, setSheet] = useState<ISheet | false>(false)

  useEffect(() => {
    getHomeProject().then((project) => {
      setSheet(project.sheet(name))
    })
  }, [])

  return sheet
}
