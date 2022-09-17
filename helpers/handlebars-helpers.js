const dayjs = require('dayjs') // 載入 dayjs 套件
exports.currentYear = () => dayjs().year() // 取得當年年份作為 currentYear 的屬性值，並導出

exports.isEq = function(v1, v2, options){
    if(v1 === v2){
        return options.fn(this);
    }else{
        return options.inverse(this);
    }
}