module.exports = {
    //解析选项
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module"
    },
    //具体的检查规则
    rules:{
        'no-var':2
    },
    //继承其他规则
    extends:['eslint:recommended'],
    env:{
        node:true, //启用node的全局变量
        browser:true  //启用浏览器的全局变量
    },
    Plugins:['import'] //eslint不识别动态导入
}