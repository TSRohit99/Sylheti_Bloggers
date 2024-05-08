function validation(values) {
  let errors = {};
  const password_pattern = /^(?=.*[A-Z]).{9,}$/;

  if (values.name === "") {
    errors.name = "Name nai bah apnar!";
  } else {
    errors.name = "";
  }

  if (values.area === "") {
    errors.area = "Area dilaw shormaio nah!";
  } else {
    errors.area = "";
  }

  if (values.email === "") {
    errors.email = "email chara signup korba kmne?";
  } else {
    errors.email = "";
  }

  if (values.password === "") {
    errors.password = "password kali raka jaito nay!";
  } else if (!password_pattern.test(values.password)) {
    errors.password = "password o 8 digit r ekta capital letter takto oibo";
  } else {
    errors.password = "";
  }

  return errors;
}

export default validation;
