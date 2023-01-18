import React, { createContext, useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import GeneralErrorPage from '../../pages/Commons/GeneralError';
import ErrorCodeEnum from '../../enums/errorCode.enum';
import NotFoundPage from '../../pages/NotFound';

type ErrorDefaultValue = {
  errorCode?: number;
  setErrorCode: React.Dispatch<React.SetStateAction<number | undefined>>;

};

const showSnackbarCodes = [
  ErrorCodeEnum.COMMON_INDEX_OUT_OF_BOUND.valueOf(),
  ErrorCodeEnum.COMMON_API_NOT_SUPPORTED.valueOf()
];

// A context will be the way that we allow components lower down
// the tree to trigger the display of an error page
const ErrorStatusContext = createContext<ErrorDefaultValue>({setErrorCode: () => {}});

// The top level component that will wrap our app's core features
const ErrorHandler = ({children}: any) => {
  const history = useHistory();
  const {showErrorMessage} = useCustomSnackbar();
  const [errorCode, setErrorCode ] = useState<number>();

  // Make sure to "remove" this status code whenever the user
  // navigates to a new URL. If we didn't do that, then the user
  // would be "trapped" into error pages forever
  useEffect(() => {
    // Listen for changes to the current location.
    // cleanup the listener on unmount
    return history.listen(() => setErrorCode(undefined));
  }, [])

  addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled API rejection: ' + event.reason);
    setErrorCode(ErrorCodeEnum.COMMON_UNDEFINED_ERROR.valueOf());
  });

  addEventListener('error', (event) => {
    console.error('Unhandled error: ' + event.message);
    // Should consider whether we should redirect to error page
    //setErrorCode(ErrorCodeEnum.COMMON_UNDEFINED_ERROR.valueOf());
  });

  // This is what the component will render. If it has an
  // errorStatusCode that matches an API error, it will only render
  // an error page. If there is no error status, then it will render
  // the children as normal
  const renderContent = () => {
    console.log('Error in handler: ' + errorCode);

    if (errorCode == undefined) return children;

    if (errorCode === ErrorCodeEnum.COMMON_PAGE_NOT_FOUND.valueOf()) {
      return <NotFoundPage/>
    } else if (showSnackbarCodes.indexOf(errorCode) != -1) {
      showErrorMessage('Something went wrong');
      return children;
    }

    return <GeneralErrorPage message='con meo error'/>
  }

  // We expose the context's value down to our components, while
  // also making sure to render the proper content to the screen
  return (
    <ErrorStatusContext.Provider value={{errorCode: errorCode, setErrorCode: setErrorCode}}>
      {renderContent()}
      </ErrorStatusContext.Provider>
  )
}

// A custom hook to quickly read the context's value. It's
// only here to allow quick imports
export const useErrorStatus = () => useContext(ErrorStatusContext);

export const getStatusCodeFromResponse = (response: any) => {
  if ('statusCode' in response) {
    return response.statusCode;
  }
  return ErrorCodeEnum.COMMON_UNDEFINED_ERROR;
}

export default ErrorHandler;