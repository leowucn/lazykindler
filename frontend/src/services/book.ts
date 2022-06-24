import { axiosInstance } from './axios';

// 获取全部书籍信息列表
export const getBooksMeta = (storeType: string) => {
    return axiosInstance.get(`/api/book/all_meta?storeType=${storeType}`).then((data: any) => {
        return data.data;
    });
};

// 获取指定uuids的书籍列表
//
// uuids是以分号连接的书籍uuid字符串
export const getBooksMetaByUUIDs = (uuids: string) => {
    return axiosInstance.get(`/api/book/get/uuids?uuids=${uuids}`).then((data: any) => {
        return data.data;
    });
};

// 获取封面
export const getCover = (uuid: string) => {
    return axiosInstance.get(`/api/book/cover?uuid=${uuid}`).then((data: any) => {
        return data.data;
    });
};

// 修改书籍元数据信息
export const updateBookMeta = async (uuid: string, key: string, value: any) => {
    if (value == null) {
        value = '';
    }
    const data = await axiosInstance.post(`/api/book/update`, {
        uuid: uuid,
        key: key,
        value: value,
    });
    return data.data;
};

// 删除书籍
export const deleteBook = (uuid: string) => {
    return axiosInstance.delete(`/api/book/delete?uuid=${uuid}`).then((data: any) => {
        return data.data;
    });
};

// 根据关键词删除书籍
export const deleteBookByKeyword = (store_type: string, keyword: string, value: string) => {
    return axiosInstance
        .delete(
            `/api/book/delete/bykeyword?store_type=${store_type}&keyword=${keyword}&value=${value}`,
        )
        .then((data: any) => {
            return data.data;
        });
};

// 根据所有书籍
export const deleteAllBooks = () => {
    return axiosInstance.delete(`/api/book/delete/all`);
};

// 根据所有临时书籍
export const deleteAllTmpBooks = () => {
    return axiosInstance.delete(`/api/book/delete/all/tmp`);
};

// 上传书籍或书籍所在目录
export const uploadBooks = async () => {
    const data = await axiosInstance.post(`/api/book/upload`);
    return data.data;
};

// 更新书籍封面
export const updateBookCover = (uuid: string, cover: string) => {
    return axiosInstance.post(`/api/book/update/cover`, {
        book_uuid: uuid,
        cover,
    });
};

// 下载书籍
export const downloadBook = (uuid: string) => {
    return axiosInstance.get(`/api/book/download?uuid=${uuid}`).then((data: any) => {
        return data.data;
    });
};

// 下载所有书籍
export const downloadAllBooks = () => {
    return axiosInstance.get(`/api/book/download/all`);
};
