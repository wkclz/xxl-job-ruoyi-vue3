import router from "@/router";
import usePermissionStore from "@/store/modules/permission";
/**
 * 字符权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkPermi(value) {
  if (value && value instanceof Array && value.length > 0) {
    const routeBtns = usePermissionStore().routeBtns;
    const path = router?.currentRoute?._value?.path;

    const buttons = routeBtns[path] || [];
    const hasPermission = buttons.some(btn => value.includes(btn));
    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like checkPermi="['system:user:add','system:user:edit']"`)
    return false
  }
}
