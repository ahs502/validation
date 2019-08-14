import Validation from '../src/_Validation';

describe('Validation', () => {
  interface BookRequest {
    title: string;
    auther: string;
    edition: number;
    count: number;
  }

  interface Book {
    title: string;
    auther: string;
    editions: {
      edition: number;
      count: number;
    }[];
  }
  const bookStore: Book[] = [
    { title: 'Educated', auther: 'Tara Westover', editions: [{ edition: 1, count: 10 }, { edition: 2, count: 15 }] },
    { title: 'The Reckoning', auther: 'John Grisham', editions: [{ edition: 1, count: 10 }, { edition: 2, count: 15 }] },
    { title: 'Cook Like a Pro', auther: 'Ina Garten', editions: [{ edition: 1, count: 10 }, { edition: 2, count: 15 }] },
    { title: 'There There', auther: 'Tommy Orange', editions: [{ edition: 1, count: 10 }, { edition: 2, count: 15 }] },
    { title: 'The Soul of America', auther: 'Jon Meacham', editions: [{ edition: 1, count: 10 }, { edition: 2, count: 15 }] },
    { title: 'Past Tense', auther: 'Lee Child', editions: [{ edition: 1, count: 10 }, { edition: 2, count: 15 }] },
    { title: 'The Line Becomes a River', auther: 'Francisco Cantu', editions: [{ edition: 1, count: 10 }, { edition: 2, count: 15 }] },
    { title: 'Love and Ruin', auther: 'Paula McLain', editions: [{ edition: 1, count: 10 }, { edition: 2, count: 15 }] }
  ];

  describe('Validation reuse old results (synchronous)', () => {
    function getBookByTitle(title: string): Book | null {
      return bookStore.find(book => book.title.toUpperCase() === title.toUpperCase());
    }

    let status: {
      title?: number;
    } = {};
    class BookRequestValidation extends Validation<
      | 'TITLE_EXISTS'
      | 'TITLE_IS_VALID'
      | 'TITLE_IS_LONG_ENOUGH'
      | 'BOOK_EXISTS'
      | 'AUTHER_EXISTS'
      | 'AUTHER_IS_VALID'
      | 'TITLE_MACHES_AUTHER'
      | 'EDITION_NUMBER_EXISTS'
      | 'EDITION_NUMBER_IS_VALID'
      | 'EDITION_IS_VALID'
      | 'COUNT_EXISTS'
      | 'COUNT_IS_VALID'
      | 'COUNT_IS_POSITIVE'
      | 'COUNT_IS_NOT_TOO_HIGH'
      | 'ENOUGH_BOOKS_EXIST_IN_STORE'
    > {
      constructor(bookRequest: BookRequest, oldBookValidation?: BookRequestValidation) {
        super(
          validator =>
            validator.object(bookRequest).then(({ title, auther, edition, count }) => {
              validator
                .after(
                  validator
                    .for(title)
                    .check('TITLE_EXISTS', !!title && typeof title === 'string')
                    .then(() => {
                      validator.check('TITLE_IS_VALID', /^[a-zA-Z]*$/.test(title));
                      validator.check('TITLE_IS_LONG_ENOUGH', title.length >= 3);
                    })
                    .when('TITLE_IS_VALID', 'TITLE_IS_LONG_ENOUGH')
                    .then(() => getBookByTitle(title))
                    .check('BOOK_EXISTS', book => !!book)
                    .then(book => book!)
                    .end(),
                  validator
                    .name('auther')
                    .for(auther)
                    .check('AUTHER_EXISTS', !!auther && typeof auther === 'string')
                    .check('AUTHER_IS_VALID', () => /^[a-zA-Z]*$/.test(auther))
                    .end()
                )
                .when('BOOK_EXISTS', 'AUTHER_IS_VALID')
                .do(book => validator.check('TITLE_MACHES_AUTHER', book.auther.toUpperCase() === auther.toUpperCase()));
              validator
                .for(edition)
                .check('EDITION_NUMBER_EXISTS', typeof edition === 'number')
                .check('EDITION_NUMBER_IS_VALID', () => !!edition && edition > 0)
                .with(edition)
                .end();
              validator
                .new('store count', title, edition)
                .after<[Book, number]>('title', 'edition')
                .when('BOOK_EXISTS', 'EDITION_NUMBER_IS_VALID')
                .do((book, edition) => {
                  const bookEdition = book.editions.find(e => e.edition === edition);
                  validator.check('EDITION_IS_VALID', !!bookEdition);
                  return bookEdition.count;
                })
                .end();
              validator
                .new('count', count)
                .check('COUNT_EXISTS', typeof count === 'number')
                .check('COUNT_IS_VALID', () => !isNaN(count))
                .check('COUNT_IS_POSITIVE', () => count > 0)
                .check('COUNT_IS_NOT_TOO_HIGH', () => count <= 10)
                .end();
              validator
                .after<[number, number]>('store count', 'count')
                .when('EDITION_IS_VALID', 'COUNT_IS_POSITIVE')
                .then(([storeCount, count]) => validator.check('ENOUGH_BOOKS_EXIST_IN_STORE', storeCount >= count));
            }),
          oldBookValidation
        );
      }
    }
  });
});
