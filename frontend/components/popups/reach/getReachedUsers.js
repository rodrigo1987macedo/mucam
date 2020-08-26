export default function getUsersReachment(res, forgottenThreshold) {
  let reachedArr = [];
  let unreachedArr = [];
  //
  let unreachedNumbersArr = [];
  let unreachedUsernamesArr = [];
  let unreachedEmailsArr = [];
  //
  let forgottenNumbersArr = [];
  let forgottenUsernamesArr = [];
  let forgottenEmailsArr = [];
  //
  res.data.map(item => {
    let lastFile = item.file.slice(-1)[0];
    if (lastFile) {
      // FORGOTTEN USERS
      if (
        parseInt(Date.parse(lastFile.updated_at), 10) <
        parseInt(Date.parse(forgottenThreshold), 10)
      ) {
        // updated_at date of last file is prior than forgottenThreshold
        forgottenNumbersArr.push(item.number);
        forgottenUsernamesArr.push(item.name);
        forgottenEmailsArr.push(item.email);
      }
      // UNREACHED USERS
      if (
        !item.seen ||
        parseInt(Date.parse(lastFile.updated_at), 10) >
          parseInt(Date.parse(item.seen), 10)
      ) {
        // seen date is prior than updated_at of last file
        unreachedArr.push(item);
        //
        unreachedNumbersArr.push(item.number);
        unreachedUsernamesArr.push(item.name);
        unreachedEmailsArr.push(item.email);
      }
      // REACHED USERS
      if (
        parseInt(Date.parse(lastFile.updated_at), 10) <
        parseInt(Date.parse(item.seen), 10)
      ) {
        // seen date is posterior to updated_at of last file
        reachedArr.push(item);
      }
    }
  });
  const usersReachment = {
    reachedArr,
    unreachedArr,
    forgottenNumbersArr,
    forgottenUsernamesArr,
    forgottenEmailsArr,
    unreachedNumbersArr,
    unreachedUsernamesArr,
    unreachedEmailsArr
  }
  return usersReachment
}
