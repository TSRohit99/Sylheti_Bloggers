function validation(values) {
  let errors = {};
  const password_pattern = /^(?=.*[A-Z]).{9,}$/;
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  if (values.email === "") {
    errors.email = "email chara signup korba kmne?";
  }else if (!email_pattern.test(values.email)) {
    errors.email = "TikTak email dein!";
  } else {
    errors.email = "";
  }

  if (values.password === "") {
    errors.password = "password kali raka jaito nay!";
  }
  else if(!password_pattern.test(values.password)){
      errors.password = "password bhul ace abr try koro tik koria"
  }
  else {
    errors.password = "";
  }

  return errors;
}

export default validation;
