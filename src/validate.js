import i18next from 'i18next';
import * as yup from 'yup';

const getValidationSchema = (urlList) => {
  const getValidationMessages = () => ({
    mixed: {
      notOneOf: i18next.t('rssHasAlredy'),
      url: i18next.t('additionURL'),
      required: i18next.t('emptyInput'),
    },
  });

  const validationSchema = yup.object().shape({
    url: yup.string()
      .required()
      .notOneOf(urlList),
  });

  yup.setLocale(getValidationMessages());

  return validationSchema;
};

export default (urlString, urlList) => {
  const validationSchema = getValidationSchema(urlList);
  return validationSchema.validate({ url: urlString });
};
