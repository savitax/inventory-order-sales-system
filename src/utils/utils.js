/**
 * 精确判断JavaScript数据类型的函数
 * @param {*} value - 需要检测类型的值
 * @returns {string} - 返回值的精确类型
 */
function getType(value) {
    // 处理null的特殊情况
    if (value === null) {
        return 'null';
    }

    // 处理基本类型
    const primitiveTypes = ['number', 'string', 'boolean', 'undefined', 'symbol', 'bigint'];
    const type = typeof value;

    if (primitiveTypes.includes(type)) {
        return type;
    }

    // 处理复杂对象类型
    const objectType = Object.prototype.toString.call(value);
    const typeMap = {
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regexp',
        '[object Function]': 'function',
        '[object Promise]': 'promise',
        '[object Set]': 'set',
        '[object Map]': 'map',
        '[object WeakSet]': 'weakset',
        '[object WeakMap]': 'weakmap',
        '[object Error]': 'error',
        '[object Arguments]': 'arguments',
        '[object HTMLDivElement]': 'div',
        '[object HTMLSpanElement]': 'span',
        '[object HTMLParagraphElement]': 'paragraph',
        // 可以根据需要添加更多DOM元素类型
    };

    // 检查是否匹配预定义的对象类型
    if (typeMap[objectType]) {
        return typeMap[objectType];
    }

    // 处理自定义类实例
    if (value.constructor && value.constructor.name) {
        return value.constructor.name.toLowerCase();
    }

    // 默认返回object
    return 'object';
}

export { getType };