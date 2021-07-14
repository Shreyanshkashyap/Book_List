console.log();

// storing ISBN
const isbnNumbers = [];

// book object
class Book {
    constructor(title,author,isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI object
class UI {

    addBookToList(book,toMessage) {
        
    // creating UI object
    const ui = new UI(); 

    if(book.title === ''|| book.author === ''|| book.isbn === '') {
        if(toMessage === true) ui.sendMessage('Please fill the entry feilds','error');
    }
    else if (isbnNumbers.includes(book.isbn)) {
        if(toMessage === true) ui.sendMessage('Please enter a Unique ISBN','error');
    }
    else {
        if(toMessage === true) ui.sendMessage('Book Added!','success');

        const bookList = document.getElementById('book-list');
        const tableRow = document.createElement('tr');

        // add html to tablerow
        tableRow.innerHTML += `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete" >X</a></td>
        `;

        // adding current isbn to isbn_array
        isbnNumbers.push(book.isbn);

        // append tablerow to bookList 
        bookList.appendChild(tableRow);

        // add to LS But only on a click event 
        if(toMessage === true) Store.addBook(book);
    }
    
    }

    sendMessage(message,result) {

    // creating UI object
    const ui = new UI();

    if(result === 'success') {
        // creating alert
        const alert = document.createElement('div');
        alert.className = 'success alert';
        alert.textContent = message;

        // inserting alert above form
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(alert,form);

        // set timeout
        setTimeout(function() {
            const alert = document.querySelector('.alert');
            alert.remove();
        },2000); 
    }
    else {
        // creating alert
        const alert = document.createElement('div');
        alert.className = 'error alert';
        alert.textContent = message;

        // inserting alert above form
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(alert,form);

        // set timeout
        setTimeout(function() {
            const alert = document.querySelector('.alert');
            alert.remove();
        },2000);        
    }

    }

    clearFeilds() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

    deleteBook(e) {
        if(e.target.className === 'delete') {

            // book to be deleted
            const output = e.target.parentElement.parentElement;
            const isbnToRemove = output.children.item(2).textContent;
     
            // removing book from isbnNumbers
            isbnNumbers.forEach(function (isbn,index) {
                if(isbn === isbnToRemove) {
                    isbnNumbers.splice(index,1);
                }
            }); 
     
            // remove book
            output.remove();

            // remove from LS
            Store.removeBook(isbnToRemove);

        }
    }
}

class Store {

    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = []; 
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book) {
            const ui = new UI();
            // add book to UI
            ui.addBookToList(book,false);
        });
    }

    static addBook(book) {

        const books = Store.getBooks();

        books.push(book); 

        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbnToRemove) {

        const books = Store.getBooks();

        books.forEach(function(book,index) {
            if(book.isbn === isbnToRemove) books.splice(index,1);
        });

        localStorage.setItem('books',JSON.stringify(books));
    }
}

// add books from LS on DOM load event
document.addEventListener('DOMContentLoaded',Store.displayBooks);

// event listner
document.getElementById('book-form').addEventListener('submit',
function (e) {
    // get input feilds
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    // create objects
    const book = new Book(title,author,isbn);
    const ui = new UI();
    
    // add books to booklist
    ui.addBookToList(book,true);

    // clear input feilds
    ui.clearFeilds();

    e.preventDefault();
});

// deleting book event 
document.getElementById('output').addEventListener('click',
function (e) {

   const ui = new UI();

   ui.deleteBook(e);
});