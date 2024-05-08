function validation(values) {
  let errors = {};
  const password_pattern = /^(?=.*[A-Z]).{9,}$/;

  if (values.email === "") {
    errors.email = "email chara signup korba kmne?";
  } else {
    errors.email = "";
  }

  if (values.password === "") {
    errors.password = "password kali raka jaito nay!";
  }
  // else if(!password_pattern.test(values.password)){
  //     errors.password = "password bhul ace abr try koro tik koria"
  // }
  else {
    errors.password = "";
  }

  return errors;
}

export default validation;
