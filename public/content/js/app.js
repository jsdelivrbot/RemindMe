$(document).ready(function(){
    $('ul.tabs').tabs({
      swipeable : true,
      responsiveThreshold : 1920
    });
  });

  $("#todo").keydown(function(event) {
  if (event.which == 13) {
   event.preventDefault();
   var todo= $("#todo").val();
   app.addTodo(todo);
  }
  });
  var app = new Vue({
  el: '#app',
  data: {
    todos: [
      { text: 'Learn JavaScript', done:false },
      { text: 'Learn Vue', done:false},
      { text: 'Build something awesome', done:false}
    ],
    dones: [

    ]
  },
  methods:{
    addTodo: function(str){
      this.todos.push({text:str});
    }
  }
});