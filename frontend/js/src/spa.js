var Backbone = require('backbone');
var _ = require('underscore');

var tuti = {}; // create namespace for our app

tuti.Router = Backbone.Router.extend({
  routes: {
    '*filter' : 'setFilter'
  },
  setFilter: function(params) {
    console.log('tuti.router.params = ' + params); // just for didactical purposes.
    window.filter = params.trim() || '';
    tuti.todoList.trigger('reset');
  }
});

tuti.Todo = Backbone.Model.extend({
  defaults: {
    title: '',
    completed: false,
  },
  toggle: function(){
    this.save({completed: !this.get('completed')});
  }
});

tuti.TodoList = Backbone.Collection.extend({
  model: tuti.Todo,
  // localStorage: new Store("backbone-todo")
});

// instance of the Collection
tuti.todoList = new tuti.TodoList();

// renders individual todo items list (li)
tuti.TodoView = Backbone.View.extend({
  tagName: 'li',
  template: _.template($('#item-template').html()),
  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    this.input = this.$('.edit');
    return this; // enable chained calls
  },
  initialize: function(){
    this.model.on('change', this.render, this);
  },
  events: {
    'dblclick label' : 'edit',
    'keypress .edit' : 'updateOnEnter',
    'blur .edit' : 'close',
    'click .toggle': 'toggleCompleted'
  },
  edit: function(){
    this.$el.addClass('editing');
    this.input.focus();
  },
  close: function(){
    var value = this.input.val().trim();
    if(value) {
      this.model.save({title: value});
    }
    this.$el.removeClass('editing');
  },
  updateOnEnter: function(e){
    if(e.which == 13){
      this.close();
    }
  },
  toggleCompleted: function(){
    this.model.toggle();
  }
});


// renders the full list of todo items calling TodoView for each one.
tuti.AppView = Backbone.View.extend({
  el: '#todoapp',
  initialize: function () {
    this.input = this.$('#new-todo');
    // when new elements are added to the collection render then with addOne
    tuti.todoList.on('add', this.addOne, this);
    tuti.todoList.on('reset', this.addAll, this);
    tuti.todoList.fetch(); // Loads list from local storage
  },
  events: {
    'keypress #new-todo': 'createTodoOnEnter'
  },
  createTodoOnEnter: function(e){
    if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
      return;
    }
    tuti.todoList.create(this.newAttributes());
    this.input.val(''); // clean input box
  },
  addOne: function(todo){
    var view = new tuti.TodoView({model: todo});
    $('#todo-list').append(view.render().el);
  },
  addAll: function(){
    this.$('#todo-list').html(''); // clean the todo list
    tuti.todoList.each(this.addOne, this);
  },
  newAttributes: function(){
    return {
      title: this.input.val().trim(),
      completed: false
    };
  }
});


tuti.router = new tuti.Router();
Backbone.history.start();

tuti.appView = new tuti.AppView();