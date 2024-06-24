

const getId = () => {
getId2.id=1;
return getId2.id++;
};

yup.setLocale({
    string: {
      notOneOf: () => ({key: 'urlAlreadyExist'}),
      url: () => ({key: 'invalidUrl'}),
    }
  });


export { getId }