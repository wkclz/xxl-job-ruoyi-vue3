import request from '@/utils/request'
import {tansParams} from "@/utils/ruoyi";

export function joblogPage(data) {
    return request({
        url: '/joblog/pageList',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}

export function joblogGetJobsByGroup(data) {
    return request({
        url: '/joblog/getJobsByGroup',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}

export function joblogClearLog(data) {
    return request({
        url: '/joblog/clearLog',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}
export function joblogLogDetailCat(data) {
    return request({
        url: '/joblog/logDetailCat',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}

