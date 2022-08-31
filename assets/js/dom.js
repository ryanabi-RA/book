const unreadBookField = 'incompleteBookList';
const readedBookField = 'completeBookList';
const BOOK_ITEMID = "itemId";

const addBook = () => {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const checkBox = document.getElementById('inputBookIsComplete').checked;

    const makeRack = rackBook(title, author, year, checkBox);
    const bookObject = composeBookObject(title, author, year, checkBox);

    makeRack[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);
    
    updateDataToStorage();
}

const rackBook = (title, author, year, isCompleted) => {
    const textTitle = document.createElement('h3');
    textTitle.innerHTML = `Judul : <span>${title}</span>`;

    const textAuthor = document.createElement('p');
    textAuthor.innerHTML = `Penulis: <span>${author}</span>`;

    const textYear = document.createElement('p');
    textYear.innerHTML = `Tahun : <span>${year}</span>`;

    const textContainer = document.createElement('article');
    textContainer.classList.add('book_item');

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');

    textContainer.append(textTitle, textAuthor, textYear, actionContainer);

    if (isCompleted) {
        const listCompletedRead = document.getElementById(readedBookField);
        listCompletedRead.append(textContainer);
        actionContainer.append(createInclompleteButton() , createDeleteButton());
    } else {
        const listIncompletedRead = document.getElementById(unreadBookField);
        listIncompletedRead.append(textContainer)
        actionContainer.append(createCompleteButton(), createDeleteButton());
    }

    return textContainer
}


const createDefaultButton = (buttonTypeClass, text,  eventListener) => {
    const button = document.createElement('button');
    button.innerText = text ;    
    button.classList.add(buttonTypeClass);

    button.addEventListener('click', function(event) {  
        eventListener(event);
    });

    return button;
}

const createCompleteButton = () => {
    return createDefaultButton('green', 'Selesai dibaca', function(event) {  
        addBookToCompleted(event.target.parentElement.parentElement);
    });
}

const addBookToCompleted = (bookElement) => {
    const listCompleted = document.getElementById(readedBookField);
    const bookTitle = bookElement.querySelector(".book_item > h3 > span").innerText;
    const bookAuthor = bookElement.querySelectorAll(".book_item > p > span")[0].innerText;
    const bookYear = bookElement.querySelectorAll('.book_item > p > span')[1].innerText;

    const completedRead = rackBook(bookTitle, bookAuthor, bookYear, true);
    const book = findBook(bookElement[BOOK_ITEMID]);

    book.isCompleted = true;
    completedRead[BOOK_ITEMID] = book.id;

    listCompleted.append(completedRead);
    bookElement.remove();

    updateDataToStorage();
    
}

const removeBookFromList = (bookElement) => {
    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);
    const confirmDelete = confirm('Are You sure, delete this data ?');
    if (confirmDelete === true) {
        bookElement.remove();
        updateDataToStorage();
    } else {
        return;
    }
}


const createDeleteButton = () => {    
    return createDefaultButton('red', 'delete' , function(event) {  
        removeBookFromList(event.target.parentElement.parentElement);
    });
}

const addBookToInComplited = (bookElement) => {
    const listIncompletedRead = document.getElementById(unreadBookField);
    const bookTitle = bookElement.querySelector(".book_item > h3 > span").innerText;
    const bookAuthor = bookElement.querySelectorAll(".book_item > p > span")[0].innerText;
    const bookYear = bookElement.querySelectorAll('.book_item > p > span')[1].innerText;

    const newBook = rackBook(bookTitle, bookAuthor, bookYear, false);
    const book = findBook(bookElement[BOOK_ITEMID]);

    book.isCompleted = false;

    newBook[BOOK_ITEMID] = book.id;

    listIncompletedRead.append(newBook);
    bookElement.remove();

    updateDataToStorage();
} 

const createInclompleteButton  = () => {
    return createDefaultButton('green', 'Belum Selesai di Baca', function(event) {
        addBookToInComplited(event.target.parentElement.parentElement);
    });
}

function refreshDataFromBooks() {
    const listIncompletedRead = document.getElementById(unreadBookField);
    const listCompletedRead = document.getElementById(readedBookField);

    for (book of books) {
        const newBook = rackBook(book.title, book.author, book.year, book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;

        if (book.isCompleted) {
            listCompletedRead.append(newBook);
        } else {
            listIncompletedRead.append(newBook);
        }
    }
}