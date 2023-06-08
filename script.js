import { spawn } from 'child_process'
import { writeFile } from 'fs/promises'
import fs from 'fs'
import path from 'path';


if (!fs.existsSync('./Logs')) {
    fs.mkdirSync('./Logs');
}
const result = {
    start: getTime(),
    duration: null,
    success: true,
    commandSuccess: true,
    error: null
}

async function saveStatistics(command, args = [], timeout) {

    const childProcess = spawn(command, args, { timeout: timeout })
    const fileName = `${result.start}_${command}.json`

    childProcess.on('close', () => {
        result.duration = getDuration(result.start)

        return new Promise((resolve, reject) => {
            writeFile(path.join('./Logs', fileName), JSON.stringify(result))
                .then(() => {
                    console.log('Successfully saved!');
                    resolve('Successfully saved!')
                })
                .catch(err => {
                    reject(err)
                }
                )
        })

    })

    childProcess.on('error', (err) => {
        result.error = err
        result.commandSuccess = false

    })

    childProcess.stderr.on('data', (data) => {
        result.success = false
        result.error = err
    })

}



function getTime() {
    return Date.now()
}
function getDuration(start) {
    return getTime() - start
}


await saveStatistics('node', ['-v'], 8)
