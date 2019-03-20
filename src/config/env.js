//配置dev与prod,根据当前的npm run build/dev 进行判断使用何种url


let baseUrl = '';
let routerMode = 'hash';
let baseImgUrl = '';

baseUrl=process.env.BASE_API;
/**if (process.env.NODE_ENV) {
    baseUrl = 'http://localhost:8084';//测试环境
    baseImgUrl = '';

} else {
    baseUrl = 'http://localhost:8084';//正式环境
    baseImgUrl = '';//可同步部署图片地址
}**/


export {
    baseImgUrl, baseUrl, routerMode
}
