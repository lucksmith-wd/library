let myLibrary = [];

// *********************Data validation****************************
function checkEmpty(e) {
  item = e.target.parentNode;
  if (e.target.value.length === 0) {
    item.classList.remove('illegal-format');
    item.classList.add('empty');
  } else {
    item.classList.remove('empty');
    if (e.target === inputFields[2]) {
      checkNumberFormat(e);
    }
  }
}

function checkNumberFormat(e) {
  item = e.target.parentNode;
  if (!(/^[0-9]+$/.test(e.target.value))) {
    item.classList.add('illegal-format');
  } else {
    item.classList.remove('illegal-format');
  }
}

const inputFields = [...document.querySelectorAll('.data-entry .form-item:nth-child(-n+3)>input')]
inputFields.forEach((field) => field.addEventListener('blur', checkEmpty));

// *********************Business logic****************************

function validateNumberOnSubmission(pageNumField) {
  if (!(/^[0-9]+$/.test(pageNumField.value))) {
    pageNumField.parentNode.classList.add('illegal-format');
    return false;
  }
  return true;
}

function validateOnSubmit(e) {
  const inputs = [...e.target].splice(0, 3);
  const invalidItems = [];
  for (const input of inputs) {
    if (input.value.length === 0) {
      invalidItems.push(input.parentNode);
    }
  }
  for (let item of invalidItems) {
    item.classList.add('empty');
  }
  if (invalidItems.length > 0) {
    return false;
  }
  return validateNumberOnSubmission(inputs[inputs.length - 1])
}

function addBookToLibrary(e) {
  e.preventDefault();
  let isValid = validateOnSubmit(e);
  console.log(isValid);
  if (!isValid) {
    return;
  }


  const allInputFields = [...inputFields, document.querySelector('.data-entry #finished')];

  console.log(allInputFields);
  console.dir(allInputFields[3]);
  const book = {}

  for (let i = 0; i < allInputFields.length; i++) {
    let input = allInputFields[i];
    if (i < allInputFields.length - 1) {
      book[input.name] = input.value;
    } else {
      book.isRead = input.checked;
    }
  }

  // for (const field of inputFields) {

  // }
  myLibrary.push(book);
  console.table(myLibrary);
  inputFields.forEach((field) => field.value = "");
  allInputFields[allInputFields.length - 1].checked = false;
}

let form = document.addEventListener('submit', addBookToLibrary);
// let submitBtn = document.querySelector('.data-entry .btn');
// submitBtn.addEventListener('onsubmit', addBookToLibrary);
