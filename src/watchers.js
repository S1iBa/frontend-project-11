import { get, result } from 'lodash';
import onChange from 'on-change';
import * as yup from 'yup';


const state = {
    urlList: [],
    validationInfo: {
        isValid: true,
        invalidationType: "",
    },
    formError: '',
}

yup.setLocale({
    string: {
      notOneOf: () => ({key: 'urlAlreadyExist'}),
      url: () => ({key: 'invalidUrl'}),
    }
  
  });

const validate = (urlString) => {
    const validationSchema = yup.object().shape({
        url: yup.string()
          .url()
          .required()
          .notOneOf(state.urlList),
      });
    return validationSchema.validate({ url: urlString })
};

export default () => {
    const form = document.querySelector('.rss-form');
    const errorText = document.querySelector('.text-danger');
    form.focus();
    form.addEventListener('submit', (e) => {
        const getInput = document.querySelector('#url-input');
        e.preventDefault();
        const validEmailPromise = validate(getInput.value);
        console.log(state.urlList);
        validEmailPromise
            .then(({email}) => {
                getInput.classList.remove('invalid-url');
                state.isValid = true;
                getInput.removeAttribute('style', 'border: 1px solid red');
                state.urlList.push(getInput.value);
                form.reset();
                getInput.focus();
            })
            .catch(e => {
                if (e.type == 'url'){
                    getInput.setAttribute('style', 'border: 1px solid red');
                    errorText.textContent = 'Ссылка должна быть валидным URL';
                    getInput.focus();
                    console.log(e);
                } else if (e.type == 'notOneOf') {
                    getInput.setAttribute('style', 'border: 1px solid red');
                    errorText.textContent = 'RSS уже существует';
                    getInput.focus();
                }

                getInput.classList.add('invalid-url');
                state.validationInfo = {
                    isValid: false,
                    invalidationType: e.validationType
                }
            })
    });
}