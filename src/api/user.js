import request from '@/utils/request'
import {tansParams} from "@/utils/ruoyi";

export function userPage(data) {
    return request({
        url: '/user/pageList',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}

export function userAdd(data) {
    return request({
        url: '/user/add',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}

export function userUpdate(data) {
    return request({
        url: '/user/update',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}


export function userRemove(data) {
    return request({
        url: '/user/remove',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}

export function userUpdatePwd(data) {
    return request({
        url: '/user/updatePwd',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}
