// User Schema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/***
 * 用户数据结构如下：
 *
 * */
const UserSchema = new Schema({

  username: { type:String, required:true },
  email: { type:String, required:true },
  avatar: { type:String, default:'default.jpg' },
  password: { type:String, required:true },
  authority: { type:String, required:true ,default:'普通用户'},
  created: { type: Date },

});

UserSchema.virtual('date')
  .get(() => this._id.getTimestamp());

mongoose.model('User', UserSchema);

