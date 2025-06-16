import { ISheet } from '@theatre/core'
import studio, { IExtension } from '@theatre/studio'
// import { types } from '@theatre/core'
// import type { ISheetObject } from '@theatre/core'
import type { PaneClassDefinition, ToolsetConfig } from '@theatre/studio'
import { createRoot } from 'react-dom/client'
import { HomeProjectName } from '../Theatre/HomeProject'

// const dataConfig = {
//   exampleProp: types.stringLiteral('yes', {
//     no: 'no',
//     yes: 'yes',
//   }),
// }

const saveState = async () => {
  const json = studio.createContentOfSaveFile(HomeProjectName)
  console.log('save::', json)
  await fetch(`http://localhost:2329/states`, {
    mode: 'cors',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      stateData: json,
    }),
  })
    .then(async (r) => {
      console.log('operation::', r.ok, await r.json())
    })
    .catch((r) => {
      console.log(r)
    })
}

declare global {
  interface Window {
    autoSaveTimer?: ReturnType<typeof setTimeout>
  }
}

if (typeof window !== 'undefined') {
  clearTimeout(window.autoSaveTimer)
  window.autoSaveTimer = setTimeout(() => {
    saveState()
  }, 60 * 1000 * 5)
}

const EffectNodeUI = () => {
  //

  console.log('EffectNodeUI')

  //
  return <div className='w-full h-full bg-red-500'>EffectNodeUI</div>
}

const Pane: PaneClassDefinition = {
  class: 'effectnode',
  mount: ({ paneId, node }) => {
    //

    console.log(paneId)

    let root = createRoot(node)

    // studio.ui.renderToolset('effectNodeToolSet', node)

    root.render(<EffectNodeUI></EffectNodeUI>)

    //

    return () => {
      //

      root.render(null)
      root.unmount()

      console.log('pane closed!')

      //
    }
  },
}
//studio
export const extensionConfig: IExtension = {
  id: 'hello-world-extension',
  toolbars: {
    global(set, studio) {
      //

      // studio.onSelectionChange(() => {
      //   saveState()
      // })

      //
      set([
        // {
        //   type: 'Icon',
        //   title: 'EffectNode Pane',
        //   svgSource: '✨',
        //   onClick: () => {
        //     studio.createPane('effectnode')
        //   },
        // },
        {
          type: 'Icon',
          title: 'Save State',
          svgSource: '💾',
          onClick: () => {
            saveState()
          },
        },
      ])

      return () => {
        //
      }
      // const obj: ISheetObject<typeof dataConfig> = studio
      //   .getStudioProject()
      //   .sheet('example extension UI')
      //   .object('editor', dataConfig)

      // return obj.onValuesChange(({ exampleProp }) =>
      //   set([
      //     {
      //       type: 'Switch',
      //       value: exampleProp,
      //       onChange: (value) => studio.transaction(({ set }) => set(obj.props.exampleProp, value)),
      //       options: [
      //         {
      //           value: 'no',
      //           label: 'say no',
      //           svgSource: '👎',
      //         },
      //         {
      //           value: 'yes',
      //           label: 'say yes',
      //           svgSource: '👍',
      //         },
      //       ],
      //     },
      //     {
      //       type: 'Icon',
      //       title: 'EffectNode Pane',
      //       svgSource: '✨',
      //       onClick: () => {
      //         studio.createPane('effectnode')
      //       },
      //     },
      //   ]),
      // )
    },
    //
    effectNodeToolSet(set, studio) {
      const toolsetConfig: ToolsetConfig = [
        {
          type: 'Icon',
          title: 'Happy Button',
          svgSource: '🥰',
          onClick: () => {
            console.log('icon clicked!')
          },
        },
      ]

      set(toolsetConfig)

      return () => {
        console.log('toolbar removed!')
      }
    },
  },
  panes: [Pane],
}

// async function initDirectManipulationObject(name: string, icon: string) {
//   //
//   let sheet = await getFlyPlaneSheet()

//   // await

//   const objValues = { x: 50, y: 60 }
//   const obj = sheet.object(name, objValues)

//   // Create a div to animate
//   const div = document.createElement('div')
//   div.textContent = icon
//   Object.assign(div.style, {
//     cursor: 'grab',
//     width: '50px',
//     borderRadius: '100px',
//   })
//   document.body.append(div)
//   div.addEventListener('mousedown', () => studio.setSelection([obj]))

//   // Reposition the div whenever the Theatre.js object changes
//   // CSS transform reference: https://developer.mozilla.org/en-US/docs/Web/CSS/transform
//   obj.onValuesChange((vals) => (div.style.transform = `translate(${vals.x}px, ${vals.y}px)`))

//   let currentScrub = studio.scrub()
//   let dragX = 0
//   let dragY = 0
//   let prevVal = obj.value
//   let isDragging = false

//   div.addEventListener('mousedown', (e) => {
//     dragX = 0
//     dragY = 0
//     prevVal = obj.value
//     isDragging = true
//   })
//   document.addEventListener('mousemove', (e) => {
//     if (isDragging) {
//       dragX += e.movementX
//       dragY += e.movementY
//       currentScrub.capture(({ set }) => {
//         set(obj.props, {
//           ...prevVal,
//           x: prevVal.x + dragX,
//           y: prevVal.y + dragY,
//         })
//       })
//     }
//   })

//   document.addEventListener('mouseup', (e) => {
//     currentScrub.commit()
//     currentScrub = studio.scrub()
//     isDragging = false
//   })

//   studio.onSelectionChange((newSelecton: (ISheet | ISheetObject<any>)[]) => {
//     div.style.background = 'transparent'
//     if (newSelecton.includes(obj)) div.style.background = 'orange'
//   })
//   //
// }

// if (typeof document !== 'undefined') {
//   initDirectManipulationObject('🥚 obj', '🥚')
//   initDirectManipulationObject('🐣 obj', '🐣')
//   initDirectManipulationObject('🐥 obj', '🐥')
// }

if (process.env.NODE_ENV === 'development') {
  studio.extend(extensionConfig)
  studio.initialize()
}
