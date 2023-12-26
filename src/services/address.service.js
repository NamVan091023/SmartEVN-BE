const geolib = require('geolib');
const path = require('path');
const fs = require('fs');


const parseAddressCoordinate = async (lat, lng) => {
    if (!lat || !lng) return {};
  const point = [lng, lat];
  const log = message => {
    console.log(message);
  };
  let rawdata = fs.readFileSync(path.join(__dirname, '../utils/dvhcvn/level1s_bbox.json') );
    let level1sBbox = JSON.parse(rawdata);

  if (!level1sBbox) return log("Unexpected data", level1sBbox);

  var data = {};

  Object.keys(level1sBbox).forEach(async level1Id => {
    const bbox = level1sBbox[level1Id];
    if (!isPointInBbox(point, bbox)) return;

    let rawdata = fs.readFileSync(path.join(__dirname, '../utils/dvhcvn/'+level1Id+'.json') );
    let e1 = JSON.parse(rawdata);
    
    if (!e1 || !e1.level2s) return log("Unexpected data", e1);
    // log(`${e1.name}...`);

    e1.level2s.forEach(level2 => {
      const coords =
        level2.type === "Polygon"
          ? [level2.coordinates]
          : level2.coordinates;
      if (isPointInMultiPolygon(point, coords)) {
        data = {
          provinceId: e1.level1_id,
          provinceName: e1.name,
          districtId: level2.level2_id,
          districtName: level2.name
        };
      }
    });
  });
  return data;
  };
  

const isPointInBbox = (point, bbox) => {
    if (!point || !bbox) return false;
  
    const [lng, lat] = point;
    const [west, north, east, south] = bbox;
  
    if (lng < west || lng > east) return false;
    if (lat < north || lat > south) return false;
  
    return true;
  };
  
  const isPointInMultiPolygon = (point, coords) => {
    let result = false;
    if (!point || !coords) return result;
  
    const [longitude, latitude] = point;
    const libPoint = { latitude, longitude };
  
    coords.forEach(c0 => {
      c0.forEach(c1 => {
        const libPolygon = c1.map(c2 => ({
          latitude: c2[1],
          longitude: c2[0]
        }));
  
        if (geolib.isPointInPolygon(libPoint, libPolygon)) result = true;
      });
    });
  
    return result;
  };
  
  module.exports = {
    parseAddressCoordinate
  };