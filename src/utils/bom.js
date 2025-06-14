/* eslint-disable */
const ExcelJS = require('exceljs');
// 字符拼接
function concatStr(origin, str) {
    return origin + str;
}
// 获取列号及标题的map关系
async function readExcelFile(file) {
    const workbook = new ExcelJS.Workbook();
    let res = {};
    await workbook.xlsx.load(file).then(() => {
        const worksheet = workbook.getWorksheet("Sheet1"); // 通过索引访问第一个工作表
        worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
            if (rowIndex === 1) {
                let arr = row.model.cells
                arr.forEach((item, index) => {
                    res[item.value] = item.address.match(/[A-Z]/g)[0];
                });
                return
            };
        });
    }).catch(error => console.error('Error reading workbook', error));
    console.log(res);
    return res;
}
/**
 * 填充级别
 * @param {*} file 
 * @param {*} map 
 * @returns 
 */
async function rank(file, map) {
    console.log("填充级别");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);
    const worksheet = workbook.getWorksheet(1); // 通过索引访问第一个工作表

    let pre = null;
    worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
        if (rowIndex == 1) return; // 跳过标题行

        if (row.getCell(map["级别"]).value) {
            pre = row.getCell(map["级别"]).value - 0;
            // console.log(rowIndex + "更新pre", pre);
        } else {
            row.getCell(map["级别"]).value = pre + 1;
            pre = row.getCell(map["级别"]).value;
            // console.log(rowIndex + "递增级别", row.getCell(map["级别"]).value);
        }
    });

    // 创建一个 Blob 对象，用于存储修改后的文件内容
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return blob;
}

/**
 * 填充层级
 * @param {*} file 
 * @param {*} map 
 * @returns 
 */
async function fillLevel(file, map) {
    console.log("填充层级");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);
    const worksheet = workbook.getWorksheet(1); // 通过索引访问第一个工作表

    let exit = {};  // 存放已存在的层级编码
    let preLevel = 1;
    let preStr = "001";

    worksheet.eachRow({ includeEmpty: true }, (row, index) => {
        const jb = row.getCell(map["级别"]);
        const cj = row.getCell(map["层级"]);

        if (jb.value == 1) {
            preStr = "001";
            exit = {};
            preLevel = 1;
            cj.value = preStr;
        }
        else if (jb.value > preLevel) {
            cj.value = concatStr(preStr, ".001");
            exit[jb.value] = cj.value;
            preLevel = jb.value;
            preStr = cj.value;
        }
        else if (jb.value <= preLevel) {
            let str = exit[jb.value].substring(0, exit[jb.value].length - 1);
            let num = exit[jb.value].substring(exit[jb.value].length - 1, exit[jb.value].length) - 0;
            let res = str + (parseInt(num) + 1);
            cj.value = res;
            exit[jb.value] = res;
            preLevel = jb.value;
            preStr = res;
        }
    })

    // 创建一个 Blob 对象，用于存储修改后的文件内容
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return blob;
}
/**
 * 填充材料比例
 * @param {*} file 
 * @param {*} map 
 * @returns 
 */
async function fillScale(file, map) {
    console.log("填充比例");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);
    const worksheet = workbook.getWorksheet(1); // 通过索引访问第一个工作表

    worksheet.eachRow({ includeEmpty: true }, (row, index) => {
        const scale = row.getCell(map["材料比例"])
        if (!scale.value) {
            scale.value = 1;
        }
    });

    // 创建一个 Blob 对象，用于存储修改后的文件内容
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return blob;
}
/**
 * 填充成品品名、编码
 * @param {*} file 
 * @param {*} map 
 * @returns 
 */
async function fillNameCode(file, map) {
    console.log("填充品名、编码");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);
    const worksheet = workbook.getWorksheet(1); // 通过索引访问第一个工作表

    let str1 = '', str2 = '';

    worksheet.eachRow({ includeEmpty: true }, (row, index) => {
        const jb = row.getCell(map["级别"]);
        const code = row.getCell(map["成品品名编码"]);
        const name = row.getCell(map["成品品名"]);
        if (jb.value == 1) {
            str1 = row.getCell(map["材料编码"]).value;
            str2 = row.getCell(map["材料名称"]).value;
            console.log(str1, str2);
            name.value = str2;
            code.value = str1;
        }
        else if (jb.value > 1) {
            name.value = str2;
            code.value = str1;
        }
    });

    // 创建一个 Blob 对象，用于存储修改后的文件内容
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return blob;
}

/**
 * 增加一行包装成品
 * @param {*} file 
 * @param {*} map 
 * @returns 
 */
async function addBaoZhuang(file, map) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);
    const worksheet = workbook.getWorksheet(1); // 通过索引访问第一个工作表

    // 记录需要新增行的位置和数据
    const rowsToAdd = [];

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        const jb = row.getCell(map["级别"]);
        const cpxCode = row.getCell(map["产品线编码"]).value;
        const clCode = "*" + row.getCell(map["材料编码"]).value;
        const clName = row.getCell(map["材料名称"]).value;
        const jc = row.getCell(map["简称"]).value;

        if (jb.value === 1) {
            rowsToAdd.push({
                index: rowNumber,
                data: [cpxCode, "", "", 0, "", clCode, clName, jc, 1, ""]
            });
        }
    });

    // 新增行，注意需要从后往前新增，避免行索引变化
    for (let i = rowsToAdd.length - 1; i >= 0; i--) {
        const { index, data } = rowsToAdd[i];
        worksheet.insertRow(index, data);
    }

    // 创建一个 Blob 对象，用于存储修改后的文件内容
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return blob;
}

/**
 * 替换产品线编码
 * @param {*} file 
 * @param {*} map 
 * @returns 
 */
async function convertProductLineCode(file, map) {
    console.log("替换产品线");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);
    const worksheet = workbook.getWorksheet(1); // 通过索引访问第一个工作表

    let obj = {
        "双列球轴承": 6,
        "双列圆锥轴承": 7,
        "2代球单元": 8,
        "3代球单元": 9,
        "2代圆锥单元": 10,
        "2.5代圆锥单元": 11,
        "3代圆锥单元": 12,
        "2.5代球单元": 13,
        "1.5代单元": 14,
        "2.1代单元": 15,
        "单外圈": 16,
        "单法兰": 17
    };
    let code = null;
    worksheet.eachRow({ includeEmpty: true }, (row, index) => {
        const codeCell = row.getCell(map["产品线编码"]);
        const jb = row.getCell(map["级别"]);
        if (jb.value == 1) {
            code = obj[codeCell.value];
            codeCell.value = code;
        }
        else if (jb.value > 1) {
            codeCell.value = code;
        }
    })
    // 创建一个 Blob 对象，用于存储修改后的文件内容
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return blob;
}


/**
 * 填充销售订单序号
 * @param {*} file 
 * @param {*} map 
 * @returns 
 */
async function fillOrderIndex(file, map) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);
    const worksheet = workbook.getWorksheet("Sheet1"); // 通过索引访问第一个工作表

    let preHth = "", n = 1;
    worksheet.eachRow({ includeEmpty: true }, (row, index) => {
        const hth = row.getCell(map["销售合同号"]);
        let orderIndex = row.getCell(map["序号"]);
        if (index == 1) { }
        else if (hth.value !== preHth) {
            // n = 1;
            orderIndex.value = n = 1;
            n++;
            preHth = hth.value;
        }
        else if (hth.value === preHth) {
            orderIndex.value = n++;
        }
    });
    // 创建一个 Blob 对象，用于存储修改后的文件内容
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return blob;
}

export {
    readExcelFile,
    convertProductLineCode,
    addBaoZhuang,
    fillOrderIndex,
    rank,
    fillLevel,
    fillScale,
    fillNameCode
}