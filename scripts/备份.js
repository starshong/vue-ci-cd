import fs from 'node:fs'

import { Client } from 'ssh2'
import { exec } from 'node:child_process'
import archiver from 'archiver'

import { NodeSSH } from 'node-ssh'

const conn = new NodeSSH()

conn
  .connect({
    host: '39.101.162.187',
    username: 'root',
    password: 'P@ssw0rd123..',
    port: 22
  })
  .then(() => {
    console.log('连接成功')

    exec('rm -rf html-static.zip && pnpm run build', (err, stdout, stderr) => {
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
            conn.end()
          },
          (err) => {
            console.log('err ', err)
          }
        )
      })
    })
  })
  .catch((err) => {
    console.log('err ', err)
  })

/*
const conn = new Client()

conn
  .on('ready', () => {
    console.log('连接成功')
    // execSync('pnpm run build', { stdio: 'inherit' })
    exec('rm -rf html-static.zip && pnpm run build', (err, stdout, stderr) => {
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
        conn.sftp((err, sftp) => {
          if (err) throw err
          sftp.fastPut('html-static.zip', '/data/html.zip', (err) => {
            if (err) throw err
            console.log('上传成功')
            conn.exec('ls -a /data', (err) => {
              if (err) throw err
              console.log('解压成功')
              conn.end()
            })
          })
        })
      })
    })
  })
  .connect({
    host: '39.101.162.187',
    port: 22,
    username: 'root',
    password: 'P@ssw0rd123..'
  })
  */
