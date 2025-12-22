const fs = require('fs');
const key = fs.readFileSync('./loanlink-7a1ec-firebase-adminsdk-fbsvc-82fe0bddfe.json', 'utf8')
const base64 = Buffer.from(key).toString('base64')
console.log(base64)