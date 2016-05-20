// /* jshint -W097 */
// 'use strict'
//
// var Reference = require('./reference')
// var ColorValue = require('./color_value')
//
// class Metadata {
//   constructor (name, value) {
//     this.name = name
//     this.value = this.fixValue(value)
//     this.type = 'Metadata'
//     this.parent = null
//   }
//   fixValue (value) {
//     var newValue = value
//     if (typeof (value) === 'string') {
//       if (value.match(/^=/)) {
//         // shortcut for creating references
//         let name = value.slice(1).trim()
//         newValue = new Reference('metachild', name)
//       } else if (value.match(/^#([a-fA-F0-9]){3,8}/) || value.match(/^rgba?\(.*\)$/)) {
//         // shortcut for creating colors
//         newValue = ColorValue.fromColorValue(value)
//       } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'yes') {
//         newValue = true
//       } else if (value.toLowerCase() === 'false' || value.toLowerCase() === 'no') {
//         newValue = false
//       } else if (value.match(/^[0-9\.,]+$/)) {
//         let num = parseFloat(value)
//         if (!isNaN(num)) {
//           newValue = num
//         }
//       }
//     }
//   }
//   return newValue
// }
//
// module.exports = Metadata
