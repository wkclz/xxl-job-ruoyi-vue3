import request from '@/utils/request'
import {tansParams} from "@/utils/ruoyi";

export function loginXxlJob(data) {
    return request({
        url: '/login',
        method: 'post',
        data: tansParams(data),
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}

export function logoutXxlJob() {
    return request({
        url: '/logout',
        method: 'post',
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
}

