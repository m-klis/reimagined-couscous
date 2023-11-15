const { nanoid } = require('nanoid')
const booksData = require('./books')

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })

    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })

    response.code(400)
    return response
  }

  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = readPage === pageCount

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  booksData.push(newBook)

  const isSuccess = booksData.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })

    response.code(201)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku Gagal ditambahkan'
  })

  response.code(500)
  return response
}

const getAllBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query
  const resBooks = []
  const tempBooks = booksData.slice()

  //   console.log(`BEGIN : ${JSON.stringify(tempBooks)}`)

  if (reading === '1' || reading === '0') {
    const isReading = reading === '1'
    const temp = tempBooks.filter((book) => book.reading === isReading)
    tempBooks.splice(0, tempBooks.length, ...temp)
  }

  //   console.log(`AFTER READING : ${JSON.stringify(tempBooks)}`)

  if (finished === '1' || finished === '0') {
    const isFinished = finished === '1'
    const temp = tempBooks.filter((book) => book.finished === isFinished)
    tempBooks.splice(0, tempBooks.length, ...temp)
  }

  //   console.log(`AFTER FINISHED : ${JSON.stringify(tempBooks)}`)

  if (typeof name === 'string') {
    const queryName = name.toLowerCase()
    const temp = tempBooks.filter((book) => book.name.toLowerCase().includes(queryName))
    tempBooks.splice(0, tempBooks.length, ...temp)
  }

  //   console.log(`AFTER FILTER NAME : ${JSON.stringify(tempBooks)}`)

  for (let i = 0; i < tempBooks.length; i++) {
    resBooks.push({
      id: tempBooks[i].id,
      name: tempBooks[i].name,
      publisher: tempBooks[i].publisher
    })
  }

  const response = h.response({
    status: 'success',
    data: {
      books: resBooks
    }
  })
  response.code(200)
  return response
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = booksData.filter((book) => book.id === bookId)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })

  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload
  const updatedAt = new Date().toISOString()

  const index = booksData.findIndex((book) => book.id === bookId)

  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  if (index !== -1) {
    booksData[index] = {
      ...booksData[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })

  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = booksData.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    booksData.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
