const ErrorMessageFallBackUI = ({ message }: { message: string }) => (
  <div
    className=" flex-1 h-full items-center justify-center bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-lg p-4 text-center"
    role="alert"
    aria-live="assertive"
  >
    {message}
  </div>
);

export default ErrorMessageFallBackUI;