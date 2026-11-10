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
      catalog: true
    }
  },
  image: {
    enable: true,
    platform: 'local',
    local: {
      outputDir: './source/assets',
      prefixKey: '/assets',
      pathFollowDoc: false,
    }
  }
}
