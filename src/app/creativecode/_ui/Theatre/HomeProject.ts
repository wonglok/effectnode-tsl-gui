import { getProject } from '@theatre/core'

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
    config.state = await import('../../../../../public/states/current/state.json').then((r) => r.default)
  }

  const project = await getProject(HomeProjectName, config)

  return project
}
