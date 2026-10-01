// Starts the API server and the Vite dev server together: `npm run dev:all`
import { spawn } from 'node:child_process'

const run = (command, args) => spawn(command, args, { stdio: 'inherit', shell: true })

const processes = [run('node', ['server/index.js']), run('npx', ['vite'])]

function stopAll() {
  processes.forEach((child) => child.kill())
}

process.on('SIGINT', stopAll)
process.on('SIGTERM', stopAll)
processes.forEach((child) => child.on('exit', stopAll))
