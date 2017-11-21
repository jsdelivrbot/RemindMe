
$(document).ready(function(){
    $('ul.tabs').tabs({
      swipeable : true,
      responsiveThreshold : 1920
    });
  });
  var socket = io.connect("https://remind-me-web.herokuapp.com");
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
    todos: [],
    dones: []
  },
  methods:{
    addTodo: function(str){
      var nTodo = {"text":str,"done":false};
      socket.emit('change-notify',nTodo);
      this.todos.push(JSON.stringify(nTodo));
    }
  },mounted(){

  }
});

socket.on('list-changed',function(data){
  app.todos=data;
});