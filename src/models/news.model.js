const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const newsWebSchema = mongoose.Schema(
  {
    
    link: {
        type: String, 
        trim: true
    },
    title: {
        type: String,
        trim: true
    },
   
    topic: {
        type: String,
        trim: true
    },

    author: {
        type: String,
        trim: true
    },
    time: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        trim: true
    },
    image: [{
        type: String
    }],
    tags: [{
        type: Object,
    }]
  }
);

// add plugin that converts mongoose to json
newsWebSchema.plugin(toJSON);
newsWebSchema.plugin(paginate);

const newsFBSchema = mongoose.Schema(
    {
      
      id: {
          type: String, 
          trim: true
      },
      permalink_url: {
          type: String,
          trim: true
      },
     
      message: {
          type: String,
          trim: true
      },
  
      full_picture: {
          type: String,
          trim: true
      },
      from: {
          type: Object,
      },
      object_id: {
          type: String,
          trim: true
      },
      created_time: {
          type: Object
      },
      type: {
          type: String,
          tring: true
      }
    }
  );

// add plugin that converts mongoose to json
newsFBSchema.plugin(toJSON);
newsFBSchema.plugin(paginate);

const RacThai = mongoose.model('racthai', newsWebSchema);
const ONhiemNuoc = mongoose.model('onhiemnuoc', newsWebSchema);
const ONhiemKhongKhi = mongoose.model('onhiemkhongkhi', newsWebSchema);
const NuocThai = mongoose.model('nuocthai', newsWebSchema);
const ChatThai = mongoose.model('chatthai', newsWebSchema);
const MoiTruong = mongoose.model('environment', newsWebSchema);
const FBNews = mongoose.model('fbpost', newsFBSchema);

module.exports = {
    RacThai,
    ONhiemKhongKhi,
    ONhiemNuoc,
    NuocThai,
    ChatThai,
    MoiTruong,
    FBNews
}
