import fs from 'node:fs'

import { exec } from 'node:child_process'
import archiver from 'archiver'

import { NodeSSH } from 'node-ssh'
import gaze from 'gaze'

const conn = new NodeSSH()

// conn
//   .connect({
//     host: '39.101.162.187',
//     username: 'root',
//     password: 'P@ssw0rd123..',
//     port: 22
//   })
//   .then(() => {
//     console.log('连接成功,开始打包')

//     exec('rm -rf html-static.zip && pnpm run build', (err, stdout, stderr) => {
//       if (err) {
//         console.log(err)
//         return
//       }
//       console.log('stdout', stdout)

//       console.log('打包成功，开始上传')
//       console.log('files', files)
//       conn.putDirectory('html', '/data/html').then(
//         () => {
//           console.log('上传成功')
//           conn.dispose()
//         },
//         (err) => {
//           console.log('err ', err)
//         }
//       )
//     })
//   })
//   .catch((err) => {
//     console.log('err ', err)
//   })

exec('rm -rf html-static.zip && pnpm run build', (err, stdout, stderr) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('stdout', stdout)

  console.log('打包成功，开始上传')

  gaze('html', (err, watcher) => {
    // let watched = this.watched()
    if (err) {
      console.log(err)
      return
    }

    watcher.on('change', (file) => {
      console.log('change', file)
      // put('html', '/data/html')
      console.log(filepath + ' was changed')
    })
  })
})

function put(localPath, remotePath) {
  conn
    .connect({
      host: '39.101.162.187',
      username: 'root',
      password: 'P@ssw0rd123..',
      port: 22
    })
    .then(() => {
      console.log('连接成功')
      conn.putDirectory(localPath, remotePath).then(
        () => {
          console.log('上传成功')
          conn.dispose()
        },
        (err) => {
          console.log('err ', err)
        }
      )
    })
    .catch((err) => {
      console.log('err ', err)
    })
}
