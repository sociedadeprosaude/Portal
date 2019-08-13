export default (value) => {
  if (value !== null && value !== undefined) {
    let stringArray = ''
    if (value.indexOf('T') > -1) {
      stringArray = value.split('-')
      let year = stringArray[0]
      let month = stringArray[1]
      let day = stringArray[2].split('T')[0]
      let hour = stringArray[2].split('T')[1].substring(0, 5)
      let returnString = day + '/' + month + '/' + year
      if (hour !== '' && hour !== undefined) {
        returnString = returnString + ' - ' + hour
      }
      return returnString
    }
    if (value.indexOf('-') > -1) {
      stringArray = value.split('-')
      let year = stringArray[0]
      let month = stringArray[1]
      let day = stringArray[2].split(' ')[0]
      let hour = stringArray[2].split(' ')[1]
      let returnString = day + '/' + month + '/' + year
      if (hour !== '' && hour !== undefined) {
        returnString = returnString + ' - ' + hour
      }
      return returnString
    }
    stringArray = value.split(' ')
    let year = stringArray[0]
    let day = year.substr(year.length - 2, 2)
    let month = year.substr(5, 2)
    let justYear = year.substr(0, 4)

    year = day + '/' + month + '/' + justYear
    let hour = ''
    if (stringArray.length > 1) {
      hour = stringArray[1]
    }
    if (hour === '' || hour === undefined) {
      return year
    } else {
      return year + ' - ' + hour.substr(0, 5)
    }
  } else {
    return 'Sem Data'
  }
}
