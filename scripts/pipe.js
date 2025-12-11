import { Client } from 'ssh2'
import fs from 'node:fs/promises'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'url'

const conn = new Client()

conn
  .on('ready', () => {
    console.log('连接成功,开始打包')
    conn.exec(
      'rm -rf html-static.zip && pnpm run build:stage',
      (err, stream) => {
        if (err) {
          console.log(err)
          return
        }
        console.log('打包成功，开始上传')
        // console.log('stream', stream)
        // stream.on('close', (code, signal) => {
        //   console.log('code', code)
        //   console.log('signal', signal)
        //   console.log('stream', stream)
        // })

        conn.sftp((err, sftp) => {
          if (err) {
            console.log(err, 'sftp')
            return
          }
          // console.log('sftp', sftp)
          console.log(fs)
          // const file = fs.createReadStream('./html')
          // const remote = sftp.createWriteStream('/data/html-static.zip', {
          //   autoClose: true
          // })
          // file.pipe(remote)

          // file.on('data', (chunk) => {
          //   console.log('开始上传')
          //   console.log(`Uploaded: ${chunk.length} bytes`)
          // })

          // file.on('end', () => {
          //   console.log('上传成功')
          //   sftp.end()
          // })

          // file.on('error', (err) => {
          //   console.log('err ', err)
          //   sftp.end()
          // })
        })
      }
    )
  })
  .connect({
    host: '39.101.162.187',
    username: 'root',
    password: 'P@ssw0rd123..',
    port: 22
  })
