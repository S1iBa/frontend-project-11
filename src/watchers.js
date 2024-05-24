import onChange from 'on-change';
import * as yup from 'yup';
import i18next from 'i18next';


const stateWrapper = {
    state: {
        urlList: [],
        validationInfo: {
            isValid: true,
            invalidationType: "",
        },
    }
};
const stateWrapperWatched = onChange(stateWrapper, function () {
    renderForm()
});

// #validation
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
          .notOneOf(stateWrapperWatched.state.urlList),
      });
    return validationSchema.validate({ url: urlString })
};
//validation end

//clicker
const clicker = () => {
        const form = document.querySelector('.rss-form');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const getInput = document.querySelector('#url-input');
            const urlValue = getInput.value;
            const validUrlPromise = validate(urlValue);

            const oldState = stateWrapperWatched.state;
            console.log(stateWrapperWatched);

            validUrlPromise
                .then(() => {
                    console.log("success!");

                    const newUrlList = oldState.urlList + [urlValue];
                    const newValidationInfo = {...oldState.validationInfo, isValid: true, invalidationType: ""};
                    const newState = {...oldState, validationInfo: newValidationInfo, urlList: newUrlList};
                    
                    stateWrapperWatched.state = newState;
                    console.log(stateWrapperWatched);
                })
                .catch(e => {
                    console.log("error");
                    console.log(e);

                    const newValidationInfo = {...oldState.validationInfo, isValid: false, invalidationType: e.type};
                    const newState = {...oldState, validationInfo: newValidationInfo};

                    stateWrapperWatched.state = newState;
                    console.log(stateWrapperWatched);
                });
        });
    }
//#clicker end

//render
const renderForm = () => {
    console.log("render triggered!");
    console.log(stateWrapperWatched);

    const form = document.querySelector('.rss-form');
    const processingText = document.querySelector('.text-danger');
    const getInput = document.querySelector('#url-input');

    if (stateWrapperWatched.state.validationInfo.isValid === true) {
        getInput.classList.remove('invalid-url');
        stateWrapperWatched.state.validationInfo.isValid = true;
        getInput.removeAttribute('style', 'border: 1px solid red');
        processingText.textContent = i18next.t('validationForm.isValid');
        form.reset();
        getInput.focus();
        return;
    }
    
    switch (stateWrapperWatched.state.validationInfo.invalidationType) {
        case 'url': {
            getInput.classList.add('invalid-url');
            getInput.setAttribute('style', 'border: 1px solid red');
            processingText.textContent = i18next.t('validationForm.errors.errorURL');
            getInput.focus();
            break;
        }
        case 'notOneOf': {
            getInput.classList.add('invalid-url');
            getInput.setAttribute('style', 'border: 1px solid red');
            processingText.textContent = i18next.t('validationForm.errors.errorUniqueURL');
            getInput.focus();
            break;
        }
        case 'required': {
            getInput.classList.add('invalid-url');
            getInput.setAttribute('style', 'border: 1px solid red');
            processingText.textContent = i18next.t('validationForm.errors.errorRequared');
            getInput.focus();
            break;
        }
        default: {
            throw Error("Unable to parse invalidation type!");
        }
      }
}
//#render end

export default () => {
    console.log("got here");

    // вызываем обработчик пользовательского ввода
    clicker();

    // делает фокус на форме на старте приложения
    const form = document.querySelector('.rss-form');
    form.focus();
}