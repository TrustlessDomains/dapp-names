import ToastConfirm from "@/components/ToastConfirm";
import ToastError from "@/components/ToastError";
import toast from "react-hot-toast";

export const showToastError = ({ url, linkText, message }: { url?: string; linkText?: string; message?: string; }) => {
  toast.remove();
  toast.error(
    (t) => (
      <ToastError
        id={t.id}
        message={message || 'Something went wrong. Please try again later.'}
        url={url}
        linkText={linkText}
      />
    ),
    {
      duration: 50000,
      position: 'top-right',
      style: {
        maxWidth: '900px',
        borderLeft: '4px solid #FF4747',
      },
    },
  );
}

export const showToastSuccess = ({ message, url, linkText }: { url?: string; linkText?: string; message: string; }) => {
  toast.remove();
  toast.success(
    (t) => (
      <ToastConfirm
        id={t.id}
        url={url}
        message={message}
        linkText={linkText}
      />
    ),
    {
      duration: 50000,
      position: 'top-right',
      style: {
        maxWidth: '900px',
        borderLeft: '4px solid #00AA6C',
      },
    },
  );
}
