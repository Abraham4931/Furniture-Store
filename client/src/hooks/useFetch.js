import { useCallback, useEffect, useState } from "react";

/*
|--------------------------------------------------------------------------
| useFetch
|--------------------------------------------------------------------------
| Reusable hook for fetching API data.
|
| Handles:
| - Loading state
| - Data state
| - Error state
| - Initial fetching
| - Refetching
|
| Usage:
|
| const {
|   data,
|   loading,
|   error,
|   refetch,
| } = useFetch(getProducts);
|--------------------------------------------------------------------------
*/

const useFetch = (fetchFunction, options = {}) => {
  const {
    immediate = true,
    initialData = null,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    if (!fetchFunction) {
      setError("No fetch function was provided.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetchFunction();

      /*
       * Axios responses contain the actual API data
       * inside response.data.
       */
      setData(response?.data ?? null);

      return response?.data;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while fetching data.";

      setError(message);
      setData(initialData);

      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, initialData]);

  useEffect(() => {
    if (immediate) {
      fetchData().catch(() => {
        // Error is already stored in the hook state.
      });
    }
  }, [immediate, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export default useFetch;