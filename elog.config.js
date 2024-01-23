module.exports = {
  write: {
    platform: 'feishu',
    feishu: {
      type: 'space',
      wikiId: process.env.FEISHU_WIKI_ID,
      folderToken: process.env.FEISHU_FOLDER_TOKEN,
      appId: process.env.FEISHU_APP_ID,
      appSecret: process.env.FEISHU_APP_SECRET,
    }
  },
  deploy: {
    platform: 'local',
    local: {
      outputDir: './source/_posts',
      filename: 'urlname',
      format: 'matter-markdown',
      formatExt: 'elog.format.js',
    }
  },
  image: {
    enable: true,
    platform: 'qiniu',
    local: {
      outputDir: './docs/images',
      prefixKey: '/images',
      pathFollowDoc: false,
    },
    qiniu: {
      secretId: process.env.QINIU_SECRET_ID,
      secretKey: process.env.QINIU_SECRET_KEY,
      bucket: process.env.QINIU_BUCKET,
      region: process.env.QINIU_REGION,
      host: process.env.QINIU_HOST,
      prefixKey: 'blog/',
    }
  }
}
