import { reactive } from 'vue';
import { readUserBaseInfo } from '../api/personal';

export default function() {
    const userInfo: UserInfo = reactive({
        avatar: '',
        username: '',
        userCode: '',
        nickName: '',
        userStatus: 0,
        userType: '',
        birthday: '',
        gender: 0
    });

    readUserBaseInfo().then(res => {
        if (res && res.code === 1) {
            userInfo.avatar = res.data.avatar;
            userInfo.username = res.data.username;
            userInfo.userCode = res.data.userCode;
            userInfo.nickName = res.data.nickName;
            userInfo.userStatus = res.data.userStatus;
            userInfo.userType = res.data.userType;
            userInfo.birthday = res.data.birthday;
            userInfo.gender = res.data.gender;
        }
    });

    return userInfo;

}