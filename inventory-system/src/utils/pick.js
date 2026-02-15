/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (object, keys) => { // object: objek yang ingin kita ambil property nya. keys: array yang berisi nama property yang kita ambil
  return keys.reduce((obj, key) => {
    // Validasi apakah object tidak null & object tersebut memiliki properti dengan nama variabel key
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key]; // Properti dari object sumber object akan disalin ke obj[key]
    }
    return obj; // Return obj baru setelah 1 iterasi
  }, {});
};

module.exports = pick;
