import { useSnackbar } from 'notistack';

const useCustomSnackbar = () => {
  const { enqueueSnackbar } = useSnackbar();
  const DEFAULT_ERROR_MESSAGE = 'Something wrong';

  const showErrorMessage = (
    error: string | Record<string, unknown>,
    defaultMessage?: string,
  ) => {
    if (typeof error === 'string') {
      return enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      });
    }
    return enqueueSnackbar(defaultMessage ?? DEFAULT_ERROR_MESSAGE, {
      variant: 'error',
      preventDuplicate: true,
    });
  };

  const showSuccessMessage = (message: string) => {
    enqueueSnackbar(message, {
      variant: 'success',
      preventDuplicate: true,
    });
  };

  const showInfoMessage = (message: string) => {
    enqueueSnackbar(message, {
      variant: 'info',
      preventDuplicate: true,
    });
  };

  return { showErrorMessage, showSuccessMessage, showInfoMessage };
};

export default useCustomSnackbar;
