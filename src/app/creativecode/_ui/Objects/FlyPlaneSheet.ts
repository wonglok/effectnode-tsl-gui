import { getHomeProject } from '../Theatre/HomeProject'

export const FlyPlaneSheetName = 'FlyPlaneSheet'

export const getFlyPlaneSheet = async () => {
  let project = await getHomeProject()

  return project.sheet(FlyPlaneSheetName)
}
