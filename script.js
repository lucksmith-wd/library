let myLibrary = [];

// *********************Data validation****************************
function validate(e) {
  if (!isFilledIn(e.target.value, e.target.parentNode)) {
    return;
  }
  if (e.target === inputFields[2]) {
    isLegalFormat(e.target.value, e.target.parentNode)
  }
}

function isFilledIn(fieldValue, inputItem) {
  if (fieldValue.length === 0) {
    inputItem.classList.remove('illegal-format');
    inputItem.classList.add('empty');
    return false;
  }
  inputItem.classList.remove('empty');
  return true;
}

function isLegalFormat(fieldValue, inputItem) {
  if (!(/^[0-9]+$/.test(fieldValue))) {
    inputItem.classList.add('illegal-format');
    return false;
  }
  inputItem.classList.remove('illegal-format');
  return true;
}

function validateOnSubmit(inputs) {
  for (const input of inputs) {
    if (!isFilledIn(input.value, input.parentNode)) {
      return false;
    }
  }
  pageNumField = inputs[inputs.length - 1];
  return isLegalFormat(pageNumField.value, pageNumField.parentNode);
}

const inputFields = [...document.querySelectorAll('.data-entry .form-item:nth-child(-n+3)>input')]
inputFields.forEach((field) => field.addEventListener('blur', validate));


// *********************Business logic****************************


function addBookToLibrary(e) {
  e.preventDefault();
  if (!validateOnSubmit([...e.target].splice(0, 3))) {
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

  myLibrary.push(book);
  console.table(myLibrary);
  inputFields.forEach((field) => field.value = "");
  allInputFields[allInputFields.length - 1].checked = false;
}

const form = document.querySelector('.data-entry');
form.addEventListener('submit', addBookToLibrary);
// let submitBtn = document.querySelector('.data-entry .btn');
// submitBtn.addEventListener('onsubmit', addBookToLibrary);
