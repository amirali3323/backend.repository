import { PostStatus } from '../enums';

type PostEmailTemplate = {
  subject: (title: string) => string;
  html: (title: string, message?: string) => string;
};

export const POST_STATUS_EMAIL_TEMPLATES: Record<PostStatus, PostEmailTemplate> = {
  [PostStatus.PENDING]: {
    subject: (title) => `آگهی "${title}" در حال بررسی است ✍️`,
    html: (title) => `
      <div style="direction: rtl; font-family: sans-serif;">
        <p>سلام 👋</p>
        <p>
          آگهی <strong>"${title}"</strong> ثبت شده و در صف بررسی قرار دارد.
        </p>
        <p>به محض بررسی، از طریق ایمیل اطلاع‌رسانی خواهد شد.</p>
      </div>
    `,
  },

  [PostStatus.APPROVED]: {
    subject: (title) => `آگهی "${title}" تایید شد ✅`,
    html: (title) => `
      <div style="direction: rtl; font-family: sans-serif;">
        <p>خبر خوب 🎉</p>
        <p>
          آگهی <strong>"${title}"</strong> توسط تیم مدیریت تایید شد و هم‌اکنون در سایت فعال است.
        </p>
        <p>امیدواریم خیلی زود به نتیجه برسد 🌹</p>
      </div>
    `,
  },

  [PostStatus.REJECTED]: {
    subject: (title) => `آگهی "${title}" رد شد ❌`,
    html: (title, message) => `
      <div style="direction: rtl; font-family: sans-serif;">
        <p>سلام 👋</p>
        <p>
          متاسفانه آگهی <strong>"${title}"</strong> تایید نشد.
        </p>
        ${message ? `<p><strong>دلیل:</strong> ${message}</p>` : ''}
        <p>
          در صورت ویرایش، می‌توانید دوباره آن را ارسال کنید.
        </p>
      </div>
    `,
  },

  [PostStatus.RESOLVED]: {
    subject: (title) => `آگهی "${title}" به نتیجه رسید 🎉`,
    html: (title) => `
      <div style="direction: rtl; font-family: sans-serif;">
        <p>خبر خوش 🌟</p>
        <p>
          آگهی <strong>"${title}"</strong> با موفقیت به نتیجه رسید.
        </p>
        <p>
          خوشحالیم که "پیدا میشه" تونست قدمی برای آرامش شما باشه 🌹
        </p>
      </div>
    `,
  },
};
