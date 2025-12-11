import inquirer from 'inquirer'
import fs from 'node:fs'

import { exec } from 'node:child_process'
import archiver from 'archiver'

import { NodeSSH } from 'node-ssh'

import gaze from 'gaze'

const conn = new NodeSSH()

inquirer
  .prompt([
    {
      type: 'list',
      name: 'build',
      message: '请选择生产或者测试环境',
      choices: ['build', 'build:stage'],
      default: 'build'
    }
  ])
  .then((answers) => {
    console.log(answers)
    conn
      .connect({
        host: '39.101.162.187',
        username: 'root',
        password: 'P@ssw0rd123..',
        port: 22
      })
      .then(() => {
        console.log('连接成功')

        exec(
          `rm -rf html-static.zip && pnpm run ${answers.build}`,
          (err, stdout, stderr) => {
            if (err) {
              console.log(err)
              return
            }
            console.log('stdout', stdout)

            const output = fs.createWriteStream(`html-static.zip`)
            const archive = archiver('zip', {
              zlib: { level: 9 }
            })

            archive.on('error', (err) => {
              console.log('err ', err)
            })

            archive.pipe(output)
            archive.directory('html', false)
            archive.finalize()

            archive.on('finish', () => {
              console.log('打包成功')
              conn.putDirectory('html', '/data/html', (err) => {
                if (err) throw err
                console.log('上传成功')
                // conn
                //   .execCommand('unzip html.zip -d html', { cwd: '/data' })
                //   .then(() => {
                //     console.log('解压成功')
                //     conn.end()
                //   })
              })
              conn.putDirectory('html', '/data/html').then(
                () => {
                  console.log('上传成功')
                  // conn.end()
                  conn.dispose()
                  console.log(conn.isConnected())
                },
                (err) => {
                  console.log('err ', err)
                }
              )
            })
          }
        )
      })
      .catch((err) => {
        console.log('err ', err)
      })
  })
