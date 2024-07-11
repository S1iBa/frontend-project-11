import i18next from 'i18next';
import * as yup from 'yup';

export default (urlString, urlList) => {

  yup.setLocale({
    string: {
      notOneOf: i18next.t('submitProcess.errors.rssHasAlredy'),
      url: i18next.t('submitProcess.errors.additionURL'),
    }
  });

  const validationSchema = yup.object().shape({
      url: yup.string()
        .url()
        .required()
        .notOneOf(urlList),
    });

  return validationSchema.validate({ url: urlString});
};

