const fs = require('fs')
const path = require('path')
const {   
  chord,
  XPanas,
  TixID,
  AcaraNow,
  Jadwal_Sepakbola,
  JadwalTV,
  Steam,
  Steam_Detail,
  Lirik2,
  Nomina,
  KodePos
} = require('./src/tools/searcher.js')

let listModules = {};
(async () => {
	if (!Object.keys(listModules).length) {
		await loadModules(path.join(__dirname, 'src'))
	}
})()

async function loadModules(folder) {
	for (const dir of fs.readdirSync(folder)) {
		if (dir === 'utils') continue
		const dirname = path.join(folder, dir)
		try {
			const stat = fs.statSync(dirname)
			if (stat.isDirectory()) {
				loadModules(dirname)
			} else if (stat.isFile() && dirname.endsWith('.js')) {
				const moduleName = path.basename(dirname).replace('.js', '')
				listModules[moduleName] = require(dirname)
			}
		} catch (e) {
			console.log(e)
			delete listModules[dirname]
		} finally {
			listModules = Object.fromEntries(
				Object.entries(listModules).sort(([a], [b]) => a.localeCompare(b))
			)
		}
	}
}

module.exports = listModules
module.exports.chord = chord
module.exports.XPanas = XPanas
module.exports.TixID = TixID
module.exports.AcaraNow = AcaraNow
module.exports.Jadwal_Sepakbola = Jadwal_Sepakbola
module.exports.JadwalTV = JadwalTV
module.exports.Steam = Steam
module.exports.Steam_Detail = Steam_Detail
module.exports.Lirik2 = Lirik2
module.exports.Nomina = Nomina
module.exports.KodePos = KodePos