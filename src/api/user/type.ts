export interface UserVO {
  id: number;
  name: string;
  status: number;
  email: string;
  phone: string;
  createTime: Date;
}

export interface UserQuery extends PageQuery  {
  name?: string;
  dateTime?: any;
}
