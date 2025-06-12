import { v4 as uuidv4 } from 'uuid';

/**
 * 生成指定位数的唯一识别码
 * @param {number} length - 需要生成的UUID长度
 * @returns {string} - 指定长度的唯一识别码
 */
const UUID = (length = 8) => {
    // 生成完整的UUIDv4
    const fullUUID = uuidv4().replace(/-/g, '');

    // 如果需要的长度大于原始UUID的长度，重复使用UUID
    // if (length > fullUUID.length) {
    //     const repeatTimes = Math.ceil(length / fullUUID.length);
    //     const repeatedUUID = fullUUID.repeat(repeatTimes);
    //     return repeatedUUID.substring(0, length);
    // }

    // 直接截取需要的长度
    return fullUUID.substring(0, length);
};

export {
    UUID
}
