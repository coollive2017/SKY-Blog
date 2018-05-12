// Article Schema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/***
 * 文章数据结构如下：
 *
 * */
const ArticleSchema = new Schema({
  title: { type:String, required:true },
  content: { type:String, required:true },
  slug: { type:String, required:true },
  category: { type:Schema.Types.ObjectId, ref:'Category' },
  author: { type:Schema.Types.ObjectId, ref:'User' },
  published: { type:Boolean, default: false },
  meta: { type:Schema.Types.Mixed, required:true },
  comments: [ Schema.Types.Mixed ],
  created: { type: Date },


});

ArticleSchema.virtual('date')
  .get(() => this._id.getTimestamp());

mongoose.model('Article', ArticleSchema);

