import { ProjetoPage } from './app.po';

describe('projeto App', () => {
  let page: ProjetoPage;

  beforeEach(() => {
    page = new ProjetoPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
