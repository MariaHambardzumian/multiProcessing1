import { spawn } from 'child_process'
import fs from 'fs'

///// with infinity I got error: "The value of "timeout" is out of range."
async function saveStatistics(command, args = [], timeout = 9999999999999) {
    process.on('error', () => {
        console.log('hru');
        result.error = err

    })

    const childProcess = spawn(command, args, { timeout: timeout })

    const result = {
        start: getTime(),
        duration: null,
        success: true,
        commandSuccess: true,
        error: null
    }

    const fileName = `${result.start}_${command}.JSON`

    // childProcess.on('timeout', () => {
    //     console.log('Child process terminated due to timeout.');
    //     result.error = 'Not enough time'
    // });

    childProcess.on('close', () => {
        result.duration = getDuration(result.start)
        stampResullt(fileName, result)
    })

    childProcess.on('error', (err) => {
        result.duration = getDuration(result.start)
        result.error = err
        result.commandSuccess = false
        stampResullt(fileName, result)
    })

    process
        .on('unhandledRejection', (reason) => {
            result.duration = getDuration(result.start)
            result.success = false
            result.error = reason

        })
        .on('uncaughtException', err => {
            result.duration = getDuration(result.start)
            result.success = false
            result.error = err
            stampResullt(fileName, result)

        });

}


function stampResullt(filename, result) {
    spawn('mkdir', ['logs'])
        .on('exit',
            () => {
                fs.writeFile('./logs/' + filename, JSON.stringify(result), (err) => {
                    if (err)
                        console.log(err);
                })
            }
        )
}
function getTime() {
    return Date.now()
}
function getDuration(start) {
    return  getTime() - start
}

await saveStatistics('npm', ['--v'], 8)



