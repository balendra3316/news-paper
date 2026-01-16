// import { useState, useCallback, useEffect } from "react";
// import type { AxiosResponse } from "axios";

// interface ApiState<T> {
//   data: T | null;
//   loading: boolean;
//   error: any;
// }

// export default function useApi<T>(
//   apiFunc: () => Promise<AxiosResponse<T>>,
//   dependencies: any[] = []
// ) {
//   const [state, setState] = useState<ApiState<T>>({
//     data: null,
//     loading: true,
//     error: null,
//   });

//   const execute = useCallback(async () => {
//     setState((prev) => ({ ...prev, loading: true, error: null }));
//     try {
//       const response = await apiFunc();
//       setState({ data: response.data, loading: false, error: null });
//     } catch (err) {
//       setState({ data: null, loading: false, error: err });
//     }
//   }, [apiFunc]);

//   useEffect(() => {
//     execute();
//   }, dependencies);

//   return { ...state, refresh: execute };
// }

import { useState, useCallback, useEffect } from "react";
import type { AxiosResponse } from "axios";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: any;
}

export default function useApi<T>(
  apiFunc: () => Promise<AxiosResponse<T>>,
  dependencies: any[] = []
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const execute = useCallback(
    async (newApiFunc?: () => Promise<AxiosResponse<T>>) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const funcToExecute = newApiFunc || apiFunc;
        const response = await funcToExecute();
        setState({ data: response.data, loading: false, error: null });
      } catch (err) {
        setState({ data: null, loading: false, error: err });
      }
    },
    [apiFunc]
  );

  useEffect(() => {
    execute();
  }, dependencies);

  return { ...state, refresh: execute };
}
