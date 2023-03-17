/* 
  @returns {String} representation of current date in format dd-mmm-yy
*/
export const getCurrentDate = () => {
  const [, mmm, dd, yyyy] = new Date().toDateString().split(' ')
  return `${dd}-${mmm}-${yyyy.slice(2)}`
}
