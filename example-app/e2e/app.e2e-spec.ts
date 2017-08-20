import { ExampleAppPage } from './app.po';

describe('example-app App', () => {
  let page: ExampleAppPage;

  beforeEach(() => {
    page = new ExampleAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
