import { NotFoundException } from '@nestjs/common';
import { concatMap, of, OperatorFunction, throwError } from 'rxjs';

export type WhenResourceExistParam<T, R> = {
  errorMessageFn: () => string;
  returnFn: (resource: T) => R;
};

export const whenResourceExist = <T, R>(
  params: WhenResourceExistParam<T, R>
): OperatorFunction<T | null, R> => {
  return (source$) => {
    return source$.pipe(
      concatMap((resource) => {
        if (resource === null) {
          return throwError(
            () => new NotFoundException(params.errorMessageFn())
          );
        }
        return of(params.returnFn(resource));
      })
    );
  };
};
