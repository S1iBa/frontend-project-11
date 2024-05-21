import * as yup from 'yup';

const validationSchema = yup.object().shape({
    email: yup.string()
      .email('Пожалуйста, введите корректный email-адрес')
      .required('Поле email обязательно'),
  });


  const validate = (fields) => {
    try {
      schema.validateSync(fields, { abortEarly: false });
      return {};
    } catch (e) {
      return keyBy(e.inner, 'path');
    }
  };
