const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const areaForestSchema = mongoose.Schema(
  {
    
    rank: {
        type: String, 
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
   
    forest_area: {
        type: String,
        trim: true
    },

    population: {
        type: String,
        trim: true
    },
    sqare_meters_per_capita: {
        type: String,
        trim: true
    },
    
  }
);

// add plugin that converts mongoose to json
areaForestSchema.plugin(toJSON);
areaForestSchema.plugin(paginate);

const AreaForest = mongoose.model('area_forest', areaForestSchema);

module.exports = AreaForest
