declare global {
  /**
   * 分页查询参数
   */
  interface PageQuery {
    page: number;
    pageSize: number;
  }

  /**
   * 分页响应对象
   */
  interface PageResult<T> {
    list: T;
    total: number;
  }

  /**
   * 弹窗属性
   */
  interface DialogOption {
    title?: string;
    visible: boolean;
  }
  /**
   * 组件数据源
   */
  interface OptionType {
    value: number;
    label: string;
    children?: OptionType[];
  }
}
export {};
