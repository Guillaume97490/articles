let Article = require('../models/article');
const validator = require('validator');

exports.index = (req,res)=> res.render('article/index.ejs', {title: 'Liste des articles'});

exports.list = (req, res) => {
  Article.find({},(err, articles) => {
    articles.forEach(article => {
    });
  res.send(articles);
}).lean().sort({id: -1});
};

exports.displayAddForm = (req,res)=> res.render('article/form.ejs', {title: 'Nouvel article'});

exports.displayEditForm = (req,res)=> {
  Article.findById(req.params.id, (err, article)=>{
    if(err)
      return res.status(500)
    res.render('article/form.ejs', {
      title: 'Nouvel article',
      articleEdit: article
    })
  })
};

exports.add = (req, res) => {
  console.log(req.files)
  let params = {
    titre: req.body.titre,
    description: req.body.description,
  }
  if (req.files){
    let image = req.files.image;
    if ((image.mimetype == 'image/png')   ||
      (image.mimetype == 'image/jpg')   || 
      (image.mimetype == 'image/gif')   || 
      (image.mimetype == 'image/jpeg'))
      {
        params.image = image.name
  }
  image.mv(`${__dirname}/../../public/uploads/${image.name}`, function(err) {
    if (err)
      return res.status(500).send(err);
      var article = new Article(params);
      article.save((err) =>{
        if(err)
          return res.status(500).json({error: 'Une erreur est survenue'});
        req.body._id = article._id;
        global.io.emit('article', req.body);
        res.redirect('/');
      });
  
  })

  

}else{
  var article = new Article(req.body);
  article.save((err) =>{
    if(err)
      return res.status(500).json({error: 'Une erreur est survenue'});
    req.body._id = article._id;
    global.io.emit('article', req.body);
    res.redirect('/');
  });
}
}

exports.delete = (req,res) => {
  Article.findByIdAndRemove(req.params.id, (err)=>{
    if (err)
      return res.status(500).json({error: 'Une erreur est survenue'});
    global.io.emit('delArticle', req.params.id);
    res.sendStatus(200);
  });
};

exports.update = (req,res)=> {
  Article.findByIdAndUpdate(req.params.id, {
    titre: req.body.titre,
    description: req.body.description,
  },(err)=>{
    if (err)
      return res.status(500).json({error: 'Une erreur est survenue'});
    global.io.emit('updMsg', req.body);
    res.redirect('/');
  });
};