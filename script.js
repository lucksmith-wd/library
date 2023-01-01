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

function Book(allInputs) {
  for (let i = 0; i < allInputs.length - 1; i++) {
    let input = allInputs[i];
    this[input.name] = input.value;
  }
  this.isRead = allInputs.pop().checked;
}

function removeBook(e) {
  const cardToRemove = e.target.parentNode;
  console.log(cardToRemove.dataset.index);
  myLibrary.splice(cardToRemove.dataset.index, 1);
  displayAllCards();

}

function addBookToLibrary(e) {
  e.preventDefault();
  if (!validateOnSubmit([...e.target].splice(0, 3))) {
    return;
  }

  const allInputs = [...inputFields, document.querySelector('.data-entry #finished')];
  const book = new Book(allInputs);

  myLibrary.push(book);

  displayAllCards()

  console.table(myLibrary);
  inputFields.forEach((field) => field.value = "");
  allInputs[allInputs.length - 1].checked = false;
}


function displayAllCards() {
  const cardContainerNode = document.querySelector('.card-container');
  removeAllCards(cardContainerNode);
  myLibrary.forEach((book) => cardContainerNode.appendChild(createCard(book)));
}

function removeAllCards(cardContainerNode) {
  while (cardContainerNode.firstChild) {
    cardContainerNode.removeChild(cardContainerNode.firstChild);
  }
}

function toggleRead(e) {
  const i = e.target.parentNode.parentNode.dataset.index;
  myLibrary[i].isRead = !myLibrary[i].isRead;

  e.target.parentNode.classList.toggle('read');
  e.target.parentNode.classList.toggle('unread');

  e.target.src = `images/icon-${myLibrary[i].isRead ? 'read-brand' : 'unread'}.svg`;


}

/*********************Creating Cards************************************/

function createIconWrapperNode(book) {
  const iconWrapperNode = document.createElement('div');
  const status = book.isRead ? 'read' : 'unread';
  iconWrapperNode.classList.add('icon-wrapper');
  iconWrapperNode.classList.add(status);
  const icon = document.createElement('img');
  icon.classList.add('btn');
  icon.classList.add(`icon-${status}`);
  icon.src = `images/icon-${status === 'read' ? 'read-brand' : 'unread'}.svg`;
  icon.alt = `Icon for ${status} book`;
  iconWrapperNode.appendChild(icon);
  iconWrapperNode.addEventListener('click', toggleRead);
  return iconWrapperNode;
}

function createTitleNode(book) {
  const titleNode = document.createElement('h2');
  titleNode.classList.add('title');
  titleNode.textContent = book.title;
  return titleNode;
}

function createAuthorNode(book) {
  const authorNode = document.createElement('div');
  authorNode.classList.add('author');
  authorNode.textContent = `by ${book.author}`;
  return authorNode;
}

function createOtherInfoNode(book) {
  const otherInfoNode = document.createElement('div');
  otherInfoNode.classList.add('other-info');
  const pageNumNode = document.createElement('div');
  pageNumNode.classList.add('pages');
  pageNumNode.textContent = `Pages: ${book.numPages}`;
  const statusNode = document.createElement('div');
  otherInfoNode.appendChild(pageNumNode);
  statusNode.classList.add('status');
  statusNode.textContent = `Status: ${book.isRead ? '' : 'not'} read`;
  otherInfoNode.appendChild(statusNode);
  return otherInfoNode;
}

function createRemoveBtnNode(book) {
  const removeBtnNode = document.createElement('button');
  removeBtnNode.type = 'button';
  removeBtnNode.classList.add('btn');
  removeBtnNode.classList.add('btn-main');
  removeBtnNode.textContent = 'Remove Book';
  removeBtnNode.addEventListener('click', removeBook);
  return removeBtnNode;
}

function createCard(book) {
  const cardNode = document.createElement('div');
  cardNode.classList.add('card');
  cardNode.setAttribute('data-index', myLibrary.indexOf(book));
  cardNode.append(createIconWrapperNode(book));
  cardNode.append(createTitleNode(book));
  cardNode.append(createAuthorNode(book));
  cardNode.append(createOtherInfoNode(book));
  cardNode.appendChild(createRemoveBtnNode(book));
  return cardNode;
}

/***********************************************************************/

const form = document.querySelector('.data-entry');
form.addEventListener('submit', addBookToLibrary);
