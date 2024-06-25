export const formatDate = (isoString: string) => {
  const date = new Date(isoString);

  // 获取年、月、日、小时、分钟、秒
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以要加1，并保证两位数
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // 格式化成 yyyy/mm/dd hh:mm:ss
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}