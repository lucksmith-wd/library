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
  const cardToRemove = e.target.localName === "img"
    ? e.target.parentNode.parentNode
    : e.target.parentNode;
  console.dir(e.target);
  myLibrary.splice(cardToRemove.dataset.index, 1);
  displayAllCards();
  displayAllNodes();
}

function addBookToLibrary(e) {
  e.preventDefault();
  if (!validateOnSubmit([...e.target].splice(0, 3))) {
    return;
  }
  const allInputs = [...inputFields, document.querySelector('.data-entry #finished')];
  const book = new Book([...allInputs]);
  myLibrary.push(book);
  displayAllCards();
  displayAllNodes();
  inputFields.forEach((field) => field.value = "");
  console.log(allInputs[allInputs.length - 1]);
  allInputs[allInputs.length - 1].checked = false;
}

// To refactor -- repetition
function displayAllCards() {
  const containerNode = document.querySelector('.card-container');
  removeAllFromDom(containerNode);
  myLibrary.forEach((book) => containerNode.appendChild(createCard(book)));
}

function displayAllNodes() {
  const containerNode = document.querySelector('.book-list');
  removeAllFromDom(containerNode);
  myLibrary.forEach((book) => containerNode.appendChild(createNotice(book)));
}
// -----------------------------

function removeAllFromDom(containerNode) {
  while (containerNode.firstChild) {
    containerNode.removeChild(containerNode.firstChild);
  }
}

function toggleRead(e) {
  const i = e.target.parentNode.parentNode.dataset.index;
  myLibrary[i].isRead = !myLibrary[i].isRead;
  const cardIconWrapper = document.querySelector(`.card[data-index="${i}"] .icon-wrapper`);
  const noticeIconWrapper = document.querySelector(`.book[data-index="${i}"] .icon-wrapper`);
  cardIconWrapper.classList.toggle('read');
  cardIconWrapper.classList.toggle('unread');
  noticeIconWrapper.classList.toggle('read');
  noticeIconWrapper.classList.toggle('unread');
  cardIconWrapper.firstChild.src = `images/icon-${myLibrary[i].isRead ? 'read-brand' : 'unread'}.svg`;
  noticeIconWrapper.firstChild.src = `images/icon-${myLibrary[i].isRead ? 'read' : 'unread'}.svg`;
}

/*********************Creating Cards************************************/
function createIconWrapperNode(book, readIconFile, unreadIconFile) {
  const iconWrapperNode = document.createElement('div');
  const status = book.isRead ? 'read' : 'unread';
  iconWrapperNode.classList.add('icon-wrapper');
  iconWrapperNode.classList.add(status);
  const icon = document.createElement('img');
  icon.classList.add('btn');
  icon.classList.add(`icon-${status}`);
  icon.src = `${book.isRead ? readIconFile : unreadIconFile}`;
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
  cardNode.appendChild(createIconWrapperNode(book, 'images/icon-read-brand.svg', 'images/icon-unread.svg'));
  cardNode.appendChild(createTitleNode(book));
  cardNode.appendChild(createAuthorNode(book));
  cardNode.appendChild(createOtherInfoNode(book));
  cardNode.appendChild(createRemoveBtnNode(book));
  return cardNode;
}

/***********************************************************************/

function createOtherNoticeInfo(book) {
  const noticeInfoNode = document.createElement('div');
  noticeInfoNode.classList.add('other-info');
  const author = document.createElement('span');
  author.classList.add('author');
  author.textContent = book.author;
  noticeInfoNode.append(author);
  const pages = document.createElement('span');
  pages.classList.add('pages');
  pages.textContent = ` (${book.numPages} pages)`;
  noticeInfoNode.append(pages);
  return noticeInfoNode;
}

function createIconWrapperForDelete(book) {
  const iconWrapperNode = document.createElement('div');
  iconWrapperNode.classList.add('icon-wrapper');
  iconWrapperNode.classList.add('delete');
  const icon = document.createElement('img');
  icon.classList.add('btn');
  icon.classList.add(`icon-delete`);
  icon.src = 'images/icon-remove.svg';
  icon.alt = `Icon for delete book icon`;
  iconWrapperNode.appendChild(icon);
  iconWrapperNode.addEventListener('click', removeBook);
  return iconWrapperNode;
}

function createNotice(book) {
  const noticeNode = document.createElement('li');
  noticeNode.classList.add('book');
  noticeNode.setAttribute('data-index', myLibrary.indexOf(book));
  noticeNode.appendChild(createTitleNode(book));
  noticeNode.appendChild(createOtherNoticeInfo(book));
  noticeNode.appendChild(createIconWrapperNode(book, 'images/icon-read.svg', 'images/icon-unread.svg'));
  noticeNode.appendChild(createIconWrapperForDelete(book));
  return noticeNode;
}

const form = document.querySelector('.data-entry');
form.addEventListener('submit', addBookToLibrary);
