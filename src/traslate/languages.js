import i18next from "i18next";

const _resources = {
        translation: {
                errors: {
                    errorURL: "Ссылка должна быть валидным URL",
                    errorUniqueURL: "RSS уже существует",
                    errorRequared: "Поле не должно быть пустым"
                },
                isValid: 'RSS загружен',
                },
  };

  const resources = {
    ru: {
      translation: {
        "error_url": "Ссылка должна быть валидным URL",
        "error_unique_url": "RSS уже существует",
        "error_required": "Поле не должно быть пустым",
        "is_valid": 'RSS загружен',
      }
    }
  };

  i18next
  .init({
    resources,
    lng: "ru",
    debug: true,
    // interpolation: {
    //   escapeValue: false 
    // }
  });
  
    export default i18next;