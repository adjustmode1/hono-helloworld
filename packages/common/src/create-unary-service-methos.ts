import { Observable } from 'rxjs';
import { isFunction } from 'lodash';

const GRPC_CANCELLED = 'Cancelled';

export function createUnaryServiceMethod(
    client: any,
    methodName: string,
): (...args: any[]) => Observable<any> {
    return (...args: any[]) => {
        const isRequestStream = client[methodName].requestStream;
        const upstreamSubjectOrData = args[0];
        const isUpstreamSubject =
            upstreamSubjectOrData && isFunction(upstreamSubjectOrData.subscribe);

        if (isRequestStream && isUpstreamSubject) {
            return new Observable((observer) => {
                let isClientCanceled = false;
                const callArgs = [
                    (error: any, data: unknown) => {
                        if (error) {
                            if (error.details === GRPC_CANCELLED || error.code === 1) {
                                call.destroy();
                                if (isClientCanceled) {
                                    return;
                                }
                            }
                            return observer.error(error);
                        }
                        observer.next(data);
                        observer.complete();
                    },
                ];
                const maybeMetadata = args[1];
                if (maybeMetadata) {
                    callArgs.unshift(maybeMetadata);
                }
                const call = client[methodName](...callArgs);

                const upstreamSubscription = upstreamSubjectOrData.subscribe(
                    (val: unknown) => call.write(val),
                    (err: unknown) => call.emit('error', err),
                    () => call.end(),
                );

                return () => {
                    upstreamSubscription.unsubscribe();
                    if (!call.finished) {
                        isClientCanceled = true;
                        call.cancel();
                    }
                };
            });
        }
        return new Observable((observer) => {
            const call = client[methodName](...args, (error: any, data: any) => {
                if (error) {
                    return observer.error(error);
                }
                observer.next(data);
                observer.complete();
            });

            return () => {
                if (!call.finished) {
                    call.cancel();
                }
            };
        });
    };
}
