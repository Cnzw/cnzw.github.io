// 0.12.0及以上版本用法
const { matterMarkdownAdapter } = require('@elog/cli')

/**
 * 自定义文档插件
 * @param {DocDetail} doc doc的类型定义为 DocDetail
 * @param {ImageClient} imageClient 图床下载器，可用于图片上传
 * @return {Promise<DocDetail>} 返回处理后的文档对象
 */
const format = (doc, imageClient) => {
  const theDate = doc.properties.date
  const theUpdate = doc.properties.updated
  doc.properties.urlname = theDate.split(' ')[0] +'-'+ doc.properties.title
  doc.properties.date = theDate
  doc.properties.updated = theUpdate
  doc.body = matterMarkdownAdapter(doc);
  return doc;
};

module.exports = {
  format,
};