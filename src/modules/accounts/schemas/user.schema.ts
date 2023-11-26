import * as yup from 'yup';
export const CreateUserSchema: yup.ObjectSchema<any> = yup.object().shape({
  email: yup.string().email().required('Email is mandatory'),
  password: yup.string().required('Password is mandatory'),
  name: yup.string().required('Name is mandatory'),
});
