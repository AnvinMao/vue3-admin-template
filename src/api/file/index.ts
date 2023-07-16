import request from "@/utils/request";
import { FileInfo } from "./types";

/**
 * 上传文件
 *
 * @param file
 */
export function uploadFileApi(file: File): Promise<FileInfo> {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/files/upload",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 删除文件
 *
 * @param filePath 文件完整路径
 */
export function deleteFileApi(filePath?: string) {
  return request({
    url: "/files/delete",
    method: "delete",
    params: { filePath: filePath },
  });
}
