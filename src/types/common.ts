type ResponseData<T> = {
    code: number,
    msg?: string,
    data?: T | T[],
}