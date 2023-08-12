import request from '@/utils/request'
import {tansParams} from "@/utils/ruoyi";

export function jobgroupPage(data) {
    return request({
        url: '/jobgroup/pageList',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}


export function jobgroupSave(data) {
    return request({
        url: '/jobgroup/save',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}


export function jobgroupUpdate(data) {
    return request({
        url: '/jobgroup/update',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}
export function jobgroupRemove(data) {
    return request({
        url: '/jobgroup/remove',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}
