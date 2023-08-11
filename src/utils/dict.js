import useDictStore from '@/store/modules/dict'

/**
 * 获取字典数据
 */
export function useDict(...args) {
  const res = ref({});
  return (() => {
    args.forEach((dictType, index) => {
      res.value[dictType] = [];
      const dicts = useDictStore().getDict(dictType);
      if (dicts) {
        res.value[dictType] = dicts;
      } else {
        /*
        dictItems({type: dictType}).then(resp => {
          if (!resp.data) {
            console.error("枚举不存在", dictType);
            return;
          }
          res.value[dictType] = resp.data.map(p => ({
            value: isNaN(p.dictValue) ? p.dictValue : Number(p.dictValue), // 若 value 为数字，需要转成数字
            label: p.dictLabel,
            elTagType: p.elType,
            elTagClass: p.cssClass
          }))
          useDictStore().setDict(dictType, res.value[dictType]);
        })
         */
      }
    })
    return toRefs(res.value);
  })()
}
