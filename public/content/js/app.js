
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
      console.log(JSON.stringify(nTodo));
      socket.emit('change-notify',JSON.stringify(nTodo));
      this.todos.push(nTodo);
    },
    add: function(){
      var content = $("#addtxt").val();
      console.log(content);
      app.addTodo(content);
    }
  }
});

socket.on('list-changed',function(data){
  app.todos=JSON.parse(data);
});