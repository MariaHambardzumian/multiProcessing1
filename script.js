import { spawn } from 'child_process'
import fs from 'fs/promises'

spawn('mkdir', ['logs'])
async function saveStatistics(command, args = [], timeout) {

    const childProcess = spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'], timeout: timeout })

    const result = {
        start: getTime(),
        duration: null,
        success: true,
        commandSuccess: true,
        error: null
    }

    const fileName = `${result.start}_${command}.JSON`

     childProcess.on('close', async () => {
        result.duration = getDuration(result.start)
        try{
            console.log('close');
            await fs.writeFile('./logs/' + fileName, JSON.stringify(result))
        }
        catch(err){
            console.log(err);
        }
    })

    childProcess.on('error', async (err) => {
        result.duration = getDuration(result.start)
        result.error = err
        result.commandSuccess = false
        try{
            await fs.writeFile('./logs/' + fileName, JSON.stringify(result))
        }
        catch(err){
            console.log(err);
        }
    })

    childProcess.stderr.on('data',async (data) => {
        result.duration = getDuration(result.start)
        result.success = false
        result.error = err
        try{
            await fs.writeFile('./logs/' + fileName, JSON.stringify(result))
        }
        catch(err){
            console.log(err);
        }
    })

}



function getTime() {
    return Date.now()
}
function getDuration(start) {
    return getTime() - start
}

await saveStatistics('node', ['-v'], 8)

