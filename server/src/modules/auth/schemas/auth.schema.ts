import * as yup from 'yup';
export const LoginUserSchema: yup.ObjectSchema<any> = yup.object().shape({
  email: yup.string().email().required('Email is mandatory'),
  password: yup.string().required('Password is mandatory'),
});
