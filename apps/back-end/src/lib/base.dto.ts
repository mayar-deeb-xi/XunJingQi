import { Exclude, Expose, Type } from 'class-transformer';

export const BaseResponseDTO = <T extends Function>(type: T) => {
  const _class = class {
    data: T;

    pagination?: {
      skip: number;
      take: number;
      total: number;
    };
  };

  Exclude()(_class);
  Expose()(_class.prototype, 'data');
  Expose()(_class.prototype, 'pagination');
  Type(() => type)(_class.prototype, 'data');

  return _class;
};

export interface BaseResponse<T> {
  data: T;
  pagination?: {
    skip: number;
    take: number;
    total: number;
  };
}
