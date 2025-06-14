// 格式化数据
// 获取yyyy-mm-dd格式的日期字符串
function getDateString(d = new Date()) {
    let date = new Date(d);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    return year + '-' + month + '-' + day;
}

export { getDateString };