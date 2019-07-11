const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs');
let filePath = 'img'
let option = {
    url: 'https://www.doutula.com/photo/list/',
    method: 'GET',
    params: {
        page: 0
    }
}
let page_start=1
let page_stop=2589
async function getHtml() {
    let { data } = await axios(option)
    return data
}
async function get() {
    let i = page_start
    while (i < page_stop) {
        option.params.page = i
        let { data: html } = await axios(option)
        let $ = cheerio.load(html)
        let imgList = $('.img-responsive.lazy.image_dta')
        // imgList = Array(imgList)
        delete imgList.options
        delete imgList.prevObject
        delete imgList._root
        try {
            for (let index in imgList) {
                let item = imgList[index]
                if (!item.attribs || !item.attribs['data-original']) {
                    continue
                }
                let name = item.attribs['alt']
                let FileExt=item.attribs['data-original'].replace(/.+\./,".");
                name= name+FileExt
                let res = await axios.get(item.attribs['data-original'],{responseType: 'arraybuffer'})

                let data = new Buffer(res.data, 'binary')
                if (!parseInt(index)) {
                    fs.mkdirSync(`${filePath}/page${i}`)
                }
                fs.writeFileSync(`${filePath}/page${i}/${name}`, data,{encoding:"buffer"})
            }
        } catch (error) {
            console.log(error)
        }
        i++


    }
}
get()