const obj = {
  errors: {
    name: "name is required",
    email: "email is required",
  },
  message: "message is required",
};
obj.errors.name = undefined;
// console.log(Object.assign(obj, { errors: { name: undefined } }));
console.log((obj.errors.name = undefined));
