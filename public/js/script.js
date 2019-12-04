let socket = io();
socket.on('article', addArticles);
socket.on('delArt', removeArticle);
socket.on('updArt', changeArticle);


$(() => {
  $(document).on('click', '[data-art-id]', function(){
    let id = $(this).data('artId');
    window.location.assign(`/article/${id}`);
  });

  getArticles();
});

updateArticle = (updArt)=> {
  $.post(`/article/${updArt.id}`,updArt).done(redirect());
}

function changeArticle(updArt) {
  $(`[data-art-id='${updArt._id}'] h5 span`).text(updArt.titre);
  if(updArt.image) {
    $(`[data-art-id='${updArt._id}'] img`).attr('src',`uploads/${updArt.image}`);
  };
};

function getArticles(){
  $.get(`/articles`, (data) => data.forEach(addArticles));
};

function addArticles(article) {

  $("#articles").prepend(`
    <div data-art-id="${article._id}" class="card mx-3 mx-md-0 mb-3 mb-md-0 col-md-6 col-lg-4 col-xl-3 p-0">
    ${(()=>{
      if (article.image) {
        return `<img src="uploads/${article.image}" class="card-img-top" alt="${article.titre}">`
      }
      else {
        return `<img src="uploads/no-image.png" class="card-img-top" alt="${article.titre}">`
      }
    })()}
    <div class="card-body text-center px-0">
      <h5 class="card-title"><span>${article.titre}</span></h5>
      <div>
        <a href="/article/${article._id}" class="btn btn-primary"><span><i class="far fa-eye"></i></span> <span class="d-none d-md-inline-block">Voir</span></a>
        <a href="/article/${article._id}/edit" class="btn btn-warning"><span><i class="far fa-edit"></i></span> <span class="d-none d-md-inline-block">Editer</span></a>
        <button onclick="deleteArticle('${article._id}')" class="btn btn-danger"><span><i class="far fa-trash-alt"></i></span> <span class="d-none d-md-inline-block">Supprimer</span></button>
      </div>
    </div>
  </div>
  `)
  var element = $("#articles > div").first()[0];
  $(element).hide().fadeIn()
};

deleteArticle = (delArt) => $.get(`/article/${delArt}/delete`).done(removeArticle(delArt));

function removeArticle(delArt){
  $(`div[data-art-id=${delArt}]`).hide('slow', ()=> $(`div[data-art-id=${delArt}]`).remove());
};

