const axios = require('axios')
const cheerio = require('cheerio')
const fetch = require('#utils/fetcher')

async function chord(query) {
  return new Promise(async(resolve, reject) => {
   const head = {"User-Agent":"Mozilla/5.0 (Linux; Android 9; CPH1923) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.62 Mobile Safari/537.36",
	  "Cookie":"__gads=ID=4513c7600f23e1b2-22b06ccbebcc00d1:T=1635371139:RT=1635371139:S=ALNI_MYShBeii6AFkeysWDKiD3RyJ1106Q; _ga=GA1.2.409783375.1635371138; _gid=GA1.2.1157186793.1635371140; _fbp=fb.1.1635371147163.1785445876"};
  let { data } = await axios.get("http://app.chordindonesia.com/?json=get_search_results&exclude=date,modified,attachments,comment_count,comment_status,thumbnail,thumbnail_images,author,excerpt,content,categories,tags,comments,custom_fields&search="+query, {headers: head});
	axios.get("http://app.chordindonesia.com/?json=get_post&id="+data.posts[0].id, {
	  headers: head
	}).then(anu => {
	  let $ = cheerio.load(anu.data.post.content);
	  resolve({
	    title: $("img").attr("alt"),
	    chord: $("pre").text().trim()
	  });
	}).catch(reject);
});
}
async function XPanas(search = 'indonesia') {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get('http://164.68.127.15/?id=' + search)
      const $ = cheerio.load(data)
      const ajg = []
      $('#content > .mozaique.thumbs-5 > center > .thumb-block > .thumb-inside > .thumb > a').each((i, u) => {
        ajg.push({
          nonton: 'https://164.68.127.15' + $(u).attr('href'),
          img: $(u).find('img').attr('data-src'),
          title: $(u).find('img').attr('title')
        })
      })
      if (ajg.every(x => x === undefined)) return resolve({ developer: '@xorizn', mess: 'no result found' })
      resolve(ajg)
    } catch (err) {
      console.error(err)
    }
  })
}
async function TixID() {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get('https://www.tix.id/tix-now/')
      const $ = cheerio.load(data)
      const hasil = []
      $('div.gt-blog-list > .gt-item').each((i, u) => {
        hasil.push({
          link: $(u).find('.gt-image > a').attr('href'),
          image: $(u).find('.gt-image > a > img').attr('data-src'),
          judul: $(u).find('.gt-title > a').text(),
          tanggal: $(u).find('.gt-details > ul > .gt-date > span').text(),
          deskripsi: $(u).find('.gt-excerpt > p').text(),
        })
      })
      resolve(hasil)
    } catch (err) {
      console.error(err)
    }
  })
}
async function AcaraNow() {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get('https://www.jadwaltv.net/channel/acara-tv-nasional-saat-ini');
      const $ = cheerio.load(data)
      let tv = []
      $('table.table.table-bordered > tbody > tr').each((u, i) => {
        let an = $(i).text().split('WIB')
        if (an[0] === 'JamAcara') return
        if (typeof an[1] === 'undefined') return tv.push('\n' + '*' + an[0] + '*')
        tv.push(`${an[0]} - ${an[1]}`)
      })
      if (tv.every(x => x === undefined)) return resolve({ developer: '@xorizn', mess: 'no result found' })
      resolve(tv)
    } catch (err) {
      console.error(err)
    }
  })
}
async function Jadwal_Sepakbola() {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get('https://www.jadwaltv.net/jadwal-sepakbola');
      const $ = cheerio.load(data)
      let tv = []
      $('table.table.table-bordered > tbody > tr.jklIv').each((u, i) => {
        let an = $(i).html().replace(/<td>/g, '').replace(/<\/td>/g, ' - ')
        tv.push(`${an.substring(0, an.length - 3)}`)
      })
      if (tv.every(x => x === undefined)) return resolve({ developer: '@xorizn', mess: 'no result found' })
      resolve(tv)
    } catch (err) {
      console.error(err)
    }
  })
}
async function JadwalTV(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get('https://www.jadwaltv.net/channel/' + query);
      const $ = cheerio.load(data);
      const tv = []
      $('table.table.table-bordered > tbody > tr.jklIv').each((u, i) => {
        let an = $(i).text().split('WIB')
        tv.push(`${an[0]} - ${an[1]}`)
      })
      if (tv.every(x => x === undefined)) return resolve({ developer: '@xorizn', mess: 'no result found' })
      resolve(tv.join('\n'))
    } catch (err) {
      console.error(err)
    }
  })
}
async function Steam(search) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, status } = await axios.get('https://store.steampowered.com/search/?term=' + search)
      const $ = cheerio.load(data)
      const hasil = []
      $('#search_resultsRows > a').each((a, b) => {
        const link = $(b).attr('href')
        const judul = $(b).find(`div.responsive_search_name_combined > div.col.search_name.ellipsis > span`).text()
        const harga = $(b).find(`div.responsive_search_name_combined > div.col.search_price_discount_combined.responsive_secondrow > div.col.search_price.responsive_secondrow `).text().replace(/ /g, '').replace(/\n/g, '')
        var rating = $(b).find(`div.responsive_search_name_combined > div.col.search_reviewscore.responsive_secondrow > span`).attr('data-tooltip-html')
        const img = $(b).find(`div.col.search_capsule > img`).attr('src')
        const rilis = $(b).find(`div.responsive_search_name_combined > div.col.search_released.responsive_secondrow`).text()

        if (typeof rating === 'undefined') {
          var rating = 'no ratings'
        }
        if (rating.split('<br>')) {
          let hhh = rating.split('<br>')
          var rating = `${hhh[0]} ${hhh[1]}`
        }
        hasil.push({
          judul: judul,
          img: img,
          link: link,
          rilis: rilis,
          harga: harga ? harga : 'no price',
          rating: rating
        })
      })
      if (hasil.every(x => x === undefined)) return resolve({ developer: '@xorizn', mess: 'no result found' })
      resolve(hasil)
    } catch (err) {
      console.error(err)
    }
  })
}
async function Steam_Detail(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, status } = await axios.get(url)
      const $ = cheerio.load(data)
      const xorizn = []
      const img = $('#gameHeaderImageCtn > img').attr('src')
      $('div.game_area_sys_req.sysreq_content.active > div > ul > ul > li').each((u, i) => { xorizn.push($(i).text()) })
      const hasil = $('#genresAndManufacturer').html().replace(/\n/g, '').replace(/<br>/g, '\n').replace(/\t/g, '').replace(/<b>/g, '').replace(/<\/div>/g, '\n').replace(/ /g, '').replace(/<\/b>/g, ' ').replace(/<[^>]*>/g, '')
      const desc = $('div.game_description_snippet').text().replace(/\t/g, '').replace(/\n/g, '')
      const hasill = {
        desc: desc ? desc : 'Error',
        img: img ? img : 'https://i.ibb.co/G7CrCwN/404.png',
        system: xorizn.join('\n') ? xorizn.join('\n') : 'Error',
        info: hasil
      }
      resolve(hasill)
    } catch (err) {
      console.error(err)
    }
  })
}
async function Lirik2(judul) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get('https://www.musixmatch.com/search/' + judul),
        $ = cheerio.load(data),
        hasil = {},
        limk = 'https://www.musixmatch.com',
        link = limk + $('div.media-card-body > div > h2').find('a').attr('href');
      await axios.get(link).then(({ data }) => {
        const $$ = cheerio.load(data)
        hasil.thumb = 'https:' + $$('div.col-sm-1.col-md-2.col-ml-3.col-lg-3.static-position > div > div > div').find('img').attr('src')
        $$('div.col-sm-10.col-md-8.col-ml-6.col-lg-6 > div.mxm-lyrics').each(function (a, b) {
          hasil.lirik = $$(b).find('span > p > span').text() + '\n' + $$(b).find('span > div > p > span').text()
        })
      })
      resolve(hasil)
    } catch (err) {
      console.error(err)
    }
  })
}
async function Nomina(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get('https://tesaurus.kemdikbud.go.id/tematis/lema/' + query + '/nomina');
      const $ = cheerio.load(data);
      let _arti = []
      $('.search-result-area > .result-par > .contain > .result-set').each((i, u) => {
        _arti.push($(u).text().trim())
      })
      resolve({
        lema: query,
        nomina: _arti,
        length: _arti.length
      })
    } catch (err) {
      console.error(err)
    }
  })
}
async function KodePos(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get('https://nomorkodepos.com/?s=' + query);
      const $ = cheerio.load(data);
      let _data = []

      $('table.pure-table.pure-table-horizontal > tbody > tr').each((i, u) => {
        let _doto = [];
        $(u).find('td').each((l, p) => {
          _doto.push($(p).text().trim())
        })
        _data.push({
          province: _doto[0],
          city: _doto[1],
          subdistrict: _doto[2],
          village: _doto[3],
          postalcode: _doto[4]
        })
      })
      resolve(_data)
    } catch (err) {
      console.error(err)
    }
  })
}

module.exports = {
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
}
