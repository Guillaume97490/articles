let Article = require('../models/article');
const validator = require('validator');

exports.index = (req,res)=> res.render('article/index.ejs', {title: 'Liste des articles'});

exports.list = (req, res) => {
  Article.find({},(err, articles) => {
    articles.forEach(article => {
    });
  res.send(articles);
}).lean().sort({_id: 1});
};

exports.displayAddForm = (req,res)=> res.render('article/form.ejs', {title: 'Nouvel article'});

exports.displayEditForm = (req,res)=> {
  Article.findById(req.params.id, (err, article)=>{
    if(err)
      return res.status(500)
    res.render('article/form.ejs', {
      title: 'Nouvel article',
      articleEdit: article
    });
  });
};

exports.add = (req, res) => {
  let params = {
    titre: validator.escape(req.body.titre).trim(),
    description: validator.escape(req.body.description).trim(),
  }
  if (req.files){
    let image = req.files.image;
    if ((image.mimetype == 'image/png')   ||
      (image.mimetype == 'image/jpg')   || 
      (image.mimetype == 'image/gif')   || 
      (image.mimetype == 'image/jpeg'))
      {
        params.image = validator.escape(image.name)
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
  });
}else{
  var article = new Article(req.body);
  article.save((err) =>{
    if(err)
      return res.status(500).json({error: 'Une erreur est survenue'});
    req.body._id = article._id;
    global.io.emit('article', req.body);
    res.redirect('/');
  });
};
};

exports.show = (req,res) => {
  Article.findById(req.params.id, (err,article)=>{
    if (err)
      return res.status(500);
    res.render('article/show.ejs', {
      title: article.titre + ' : Détail',
      article: article,
    });
  });
};

exports.delete = (req,res) => {
  Article.findByIdAndRemove(req.params.id, (err)=>{
    if (err)
      return res.status(500).json({error: 'Une erreur est survenue'});
    global.io.emit('delArt', req.params.id);
    res.sendStatus(200);
  });
};

exports.update = (req,res)=> {
  // console.log(req.body)
  let params = {
    titre: validator.escape(req.body.titre).trim(),
    description: validator.escape(req.body.description).trim(),
  }
  if (req.files){
    let image = req.files.image;
    if ((image.mimetype == 'image/png')   ||
        (image.mimetype == 'image/jpg')   || 
        (image.mimetype == 'image/gif')   || 
        (image.mimetype == 'image/jpeg'))
        {
          params.image = validator.escape(image.name);
    };
    image.mv(`${__dirname}/../../public/uploads/${image.name}`, function(err) {
      if (err)
        return res.status(500).send(err);
      Article.findByIdAndUpdate(req.params.id, {
        titre: params.titre,
        description: params.description,
        image: params.image,
      },(err)=>{
        if (err)
          return res.status(500).json({error: 'Une erreur est survenue'});
        global.io.emit('updMsg', req.body);
        res.redirect('/');
      });
    });
  }
  else{
    console.log(params)
    Article.findByIdAndUpdate(req.params.id, {
      titre: params.titre,
      description: params.description,
    },(err)=>{
      console.log(req.params.id)
      if (err)
        return res.status(500).json({error: 'Une erreur est survenue'});
      global.io.emit('updMsg', req.body);
      res.redirect('/');
    });
  };
};