import { IPagination } from './ipagination';

export class IPaginatedResult<T> {
    result: T;
    pagination: IPagination;
}
