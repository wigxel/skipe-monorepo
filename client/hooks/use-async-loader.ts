import React from "react";

const update =
  <Props extends Record<string, unknown>>(key: string, value: boolean) =>
  (getter: Props) => ({
    ...getter,
    [key]: value,
  });

export function useLoading<T extends string>(_defaults: Record<T, boolean>) {
  const [loading, _setLoading] = React.useState(_defaults);

  const setLoading = React.useCallback(
    (key: T, value: boolean) => _setLoading(update(String(key), value)),
    [],
  );

  return {
    loading,
    setLoading,
    startLoading: React.useCallback((key: T) => setLoading(key, true), []),
    stopLoading: React.useCallback((key: T) => setLoading(key, false), []),
  };
}

export const useAsyncLoader = <T extends string>(param: Record<T, boolean>) => {
  const { loading, setLoading } = useLoading<T>(param);
  const attachLoader = React.useMemo(
    () => asyncLoading<T>(setLoading),
    [setLoading],
  );

  return {
    loading,
    attachLoader,
  };
};

/** this is a development hook for testing events **/
export const useFakerXHR = ({ timeout }: { timeout: number }) => {
  const loader = useAsyncLoader({ default: false });

  return {
    loading: loader.loading.default,
    fire: loader.attachLoader("default", (...a: any[]) => {
      return new Promise((res) => setTimeout(res, timeout));
    }),
  };
};

type ExtractVariadicFn<Fn> = Fn extends (...a: infer P) => Promise<infer R>
  ? (...a: P) => Promise<R>
  : (...a: unknown[]) => Promise<unknown>;

export const asyncLoading = <K>(
  setLoading: (key: K, state: boolean) => void,
) => {
  return <Fn>(key: K, asyncCallback: Fn): ExtractVariadicFn<Fn> =>
    // @ts-ignore
    function (...args) {
      setLoading(key, true);
      // @ts-ignore
      return asyncCallback(...args).finally(() => {
        setLoading(key, false);
      });
    };
};
