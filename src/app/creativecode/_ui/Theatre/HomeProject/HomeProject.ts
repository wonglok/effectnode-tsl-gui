import { getProject } from '@theatre/core'
// import statev001 from './'
import state001 from './data.json'

const config: any = {
  state: false,
}

if (process.env.NODE_ENV !== 'development') {
  config.state = state001
}

export const HomeProject = getProject('HomeProject', config)
