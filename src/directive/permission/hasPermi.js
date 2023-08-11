import router from "@/router";
import usePermissionStore from "@/store/modules/permission";

/**
 * v-hasPermi 操作权限处理
 * Copyright (c) 2019 ruoyi
 */

export default {
  mounted(el, binding, vnode) {
    const { value } = binding;
    const routeBtns = usePermissionStore().routeBtns;
    const path = router?.currentRoute?._value?.path;

    if (value && value instanceof Array && value.length > 0) {
      const buttons = routeBtns[path] || [];
      const hasPermissions = buttons.some(btn => value.includes(btn));
      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`请设置操作权限标签值`);
    }
  }
}
