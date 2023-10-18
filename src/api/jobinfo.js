import request from '@/utils/request'
import {tansParams} from "@/utils/ruoyi";

export function jobinfoPage(data) {
    return request({
        url: '/jobinfo/pageList',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}
export function jobinfoAdd(data) {
    return request({
        url: '/jobinfo/add',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}

export function jobinfoUpdate(data) {
    return request({
        url: '/jobinfo/update',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}

export function jobcodeSave(data) {
    return request({
        url: '/jobcode/save',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}

export function jobinfoRemove(data) {
    return request({
        url: '/jobinfo/remove',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}


export function jobinfoTrigger(data) {
    return request({
        url: '/jobinfo/trigger',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}

export function jobinfoNextTriggerTime(data) {
    return request({
        url: '/jobinfo/nextTriggerTime',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}

export function jobinfoStart(data) {
    return request({
        url: '/jobinfo/start',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}

export function jobinfoStop(data) {
    return request({
        url: '/jobinfo/stop',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}



