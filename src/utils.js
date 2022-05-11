export function converSize(size) {
  let _size = "";
  if (size < 0.1 * 1024) {
    _size = size.toFixed(2) + "B";
  } else if (size < 0.1 * 1024 * 1024) {
    _size = (size / 1024).toFixed(2) + "KB";
  } else if (size < 0.1 * 1024 * 1024 * 1024) {
    _size = (size / (1024 * 1024)).toFixed(2) + "MB";
  } else {
    _size = (size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }

  const sizestr = _size + "";
  const len = sizestr.indexOf(".");
  const dec = sizestr.substr(len + 1, 2);
  if (dec == "00") {
    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
  }
  return sizestr;
}
