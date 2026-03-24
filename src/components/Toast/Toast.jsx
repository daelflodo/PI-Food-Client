import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from '../../utils/toast';
import style from './Toast.module.css';

const ICONS = { success: '✓', error: '✕', info: 'i' };
const DURATION = 3800;

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return toast._subscribe((t) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, DURATION);
    });
  }, []);

  const dismiss = (id) => setToasts((prev) => prev.filter((x) => x.id !== id));

  return createPortal(
    <div className={style.container} aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`${style.toast} ${style[t.type]}`} role="alert">
          <span className={style.icon}>{ICONS[t.type]}</span>
          <span className={style.message}>{t.message}</span>
          <button className={style.close} onClick={() => dismiss(t.id)} aria-label="Dismiss">✕</button>
          <span className={style.progress} />
        </div>
      ))}
    </div>,
    document.body,
  );
};

export default ToastContainer;
