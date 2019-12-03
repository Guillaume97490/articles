let socket = io();
socket.on('article', addArticles);
socket.on('delArt', removeArticle)


$(() => {
//   $('#formArticle').on('submit', (e)=>{
//   e.preventDefault();
//   let params = {
//     titre: $("#titre").val().trim(),
//     description: $("#description").val().trim(),
//     image: $('#image').val(),
//   };
  
//   $('[data-update-id]').length ? (params.id = $('[data-update-id]').data('updateId').trim(),updateArticle(params)) : sendArticle(params);
// });
  getArticles();
});

sendArticle = (article) => $.post(`/article`, article).done(redirect());

function redirect(){
  setTimeout(() => {
    location.replace('/');
  }, 200);
}


updateArticle = (updArt)=> {
  $.post(`/article/${updArt.id}`,updArt).done(redirect());
}




function getArticles(){
  $.get(`/articles`, (data) => data.forEach(addArticles));
};

function addArticles(article) {
  $("#articles").append(`
  <div data-art-id="${article._id}">
  ${article.titre}
  <a href="/article/${article._id}/edit" class="btn btn-warning">Editer</a>
  <button onclick="deleteArticle('${article._id}')" class="btn btn-danger">Supprimer</button>
  </div>
  `)
};

deleteArticle = (delArt) => $.get(`/article/${delArt}/delete`).done(removeArticle(delArt));

function removeArticle(delArt){
  $(`div[data-art-id=${delArt}]`).hide('slow', ()=> $(`div[data-art-id=${delArt}]`).remove());
};

