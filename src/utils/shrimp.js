import { copyText } from "vue3-clipboard";
import {ElMessage} from "element-plus";

export function copy(text) {
    if (!text) {
        ElMessage.warning("没有要复制的内容");
        return;
    }
    copyText(text, undefined, (error) => {
        if (error) {
            ElMessage.error("复制失败: " + error)
        } else {
            ElMessage.success("复制成功")
        }
    });
}