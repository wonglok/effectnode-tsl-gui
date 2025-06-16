import express from 'express'
// import formidableMiddleware from 'express-formidable'
import writeToFile from 'write-to-file'
import cors from 'cors'
import { json } from 'express'
// import fs from 'fs/promises'
import { join } from 'path'
import moment from 'moment'

const app = express()

app.use(cors())
app.use(json({}))

// app.use(formidableMiddleware({
//     encoding: 'utf-8',
//     uploadDir: join(import.meta.dirname, '../public/states/'),
//     multiples: true, // req.files to be arrays of files
// }));

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.post('/states', async (req, res) => {

    // console.log(req?.body)
    try {

        let writeString = JSON.stringify(req?.body?.stateData, null, '\t')

        let writeCurrentPath = `${join(import.meta.dirname, '../public/states/', 'current', 'state.json')}`

        // console.log(writeCurrentPath)

        await writeToFile(writeCurrentPath, writeString)

        let writeTSPath = `${join(import.meta.dirname, '../public/states/', 'archive', `${moment(new Date()).format('YYYY-MM-DD')}`, `state-${moment().format('LT').replace(/\:/g, '_').replace(' ', '_')}.json`)}`

        // console.log(writeTSPath)

        await writeToFile(writeTSPath, writeString)

        res.json({
            ok: true
        })
    } catch (e) {
        console.log(e)
        res.json({
            ok: false,
        })
    }
})

app.listen(2329, () => {
    console.log('listenining', 2329)
})

// import('killport').then((mod) => {
//     mod
//         .default(2329)
//         .then(() => {
//             return new Promise((resolve) => {
//                 //
//                 console.log('killport 2329')
//                 setTimeout(() => {
//                     resolve(null)
//                 }, 1000 * 5)
//                 //
//             })
//         })
//         .catch(() => {
//             return new Promise((resolve) => {
//                 //
//                 console.log('killport 2329')
//                 setTimeout(() => {
//                     resolve(null)
//                 }, 1000 * 5)
//                 //
//             })
//         })
//         .then(() => {
//         })
// })