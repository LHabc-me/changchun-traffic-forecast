import { createContext } from "react";
import {
  useId,
  Button,
  Toaster,
  useToastController,
  ToastTitle,
  Toast
} from "@fluentui/react-components";

const ToastContext = createContext(null);
/*
toast.message(string): 提示消息
toast.warning(string): 警告消息
toast.error(string): 错误消息
toast.success(string): 成功消息
 */
const toast = {};
ToastContext.toast = toast;
const ToastProvider = (props) => {
  const { children } = props;
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const notify = (type, message) => {
    dispatchToast(
      <Toast>
        <ToastTitle>{message}</ToastTitle>
      </Toast>,
      { intent: type }
    );
  };
  toast.message = (message) => notify("info", message);
  toast.warning = (message) => notify("warning", message);
  toast.error = (message) => notify("error", message);
  toast.success = (message) => notify("success", message);
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Toaster toasterId={toasterId}
               position={"bottom-end"}
               pauseOnHover
               pauseOnWindowBlur
               timeout={1500} />
    </ToastContext.Provider>
  );
};
export { ToastProvider };
export default ToastContext;
