# Library REST API Design - Books Resource

## Endpoints

### 1. List All Books
* **Method:** `GET`
* **Path:** `/api/books`
* **Description:** Retrieves a list of all books in the library.
* **Success Status Code:** `200 OK`

### 2. List Books by Author
* **Method:** `GET`
* **Path:** `/api/books?author=J.K.+Rowling`
* **Description:** Retrieves a filtered list of books written by a specific author using a query parameter.
* **Success Status Code:** `200 OK`

### 3. Get a Single Book
* **Method:** `GET`
* **Path:** `/api/books/:id`
* **Description:** Retrieves details of a specific book by its unique ID.
* **Success Status Code:** `200 OK`

### 4. Create a Book
* **Method:** `POST`
* **Path:** `/api/books`
* **Description:** Adds a new book to the library inventory.
* **Example Request Body:**
  ```json
  {
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "publishedYear": 1937,
    "genre": "Fantasy"
  }
Success Status Code: 201 Created

5. Update a Book
Method: PUT

Path: /api/books/:id

Description: Updates existing details of a specific book by its ID.

Example Request Body:

JSON
{
  "title": "The Hobbit: Revised Edition",
  "author": "J.R.R. Tolkien",
  "publishedYear": 1951,
  "genre": "Fantasy"
}
Success Status Code: 200 OK

6. Delete a Book
Method: DELETE

Path: /api/books/:id

Description: Removes a book from the library database by its ID.

Success Status Code: 204 No Content

Error Handling
400 Bad Request

Example Scenario: Occurs when trying to create a book (POST /api/books) without including the required title field in the request body.

Response Body: {"error": "Validation failed: Title is required."}

404 Not Found

Example Scenario: Occurs when attempting to fetch, update, or delete a book using an ID that does not exist in the database (e.g., GET /api/books/9999).

Response Body: {"error": "Book with ID 9999 not found."}
