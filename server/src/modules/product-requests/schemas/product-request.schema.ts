import * as yup from 'yup';
export const CreateProductRequestSchema: yup.ObjectSchema<any> = yup.object().shape({
  description: yup.string().required('Email is mandatory'),
  imageUrl: yup.string().notRequired(),
});
