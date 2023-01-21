const is_android = () => {
  return /Android/i.test(navigator.userAgent);
};

const is_ios = () => {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

const is_chrome = () => {
  return /Chrome/i.test(navigator.userAgent);
};

const is_mobile = () => {
  return is_android() || is_ios();
};