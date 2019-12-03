// IMPORT DES CONTROLLERS

var article = require('../app/controllers/article');

module.exports = (app) => {

  app.get('/', article.index);

  app.get('/articles', article.list);

  app.get('/ajouter', article.displayAddForm);

  app.post('/article', article.add);

  app.get('/article/:id/edit', article.displayEditForm)

  app.get('/article/:id/delete', article.delete);

  app.post('/article/:id', article.update);

}