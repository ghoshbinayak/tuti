window.$ = require('jquery').Zepto;
var _ = require('underscore');
var Backbone = require('../libs/backbone');
var hdb = require('handlebars');
var Basil  = require('../libs/basil');
// var jdecode = require('jwt-decode');
var Tuti = {}; // create namespace


// The global event handler 
Tuti.vent = _.extend({}, Backbone.Events);

// Local storage 
Tuti.store = new Basil({
  expireDays: 7
});

// The application menu items
Tuti.AppMenu = {
  "Products": {
    url: "products",
    active: false
  },
  "Blog": {
    url: "blog",
    active: false
  },
  "About": {
    url: "about",
    active: false
  }
};


// The parent view (Mother of all)
Tuti.AppShell = Backbone.View.extend({
  el: '#app-shell-container',
  template: hdb.compile($('#app-shell').html()),
  renderShell: function(location){
    for(var key in Tuti.AppMenu){
      if(key === location){
        Tuti.AppMenu[key].active = true;
      }
      else {
        Tuti.AppMenu[key].active = false; 
      }
    }
    var token = Tuti.store.get('token');
    var user;
    if(token){
      // user = jdecode(token);
      // console.log(user);
      user = Tuti.store.get('user.email');
    }
    this.$el.html(this.template({menu: Tuti.AppMenu, user: user}));
    return this; // enable chained calls
  },
  initialize: function(){
    this.renderShell();
    Tuti.vent.on('goto:home', this.gotoHome, this);
    Tuti.vent.on('goto:login', this.gotoLogin, this);
    Tuti.vent.on('goto:about', this.gotoAbout, this);
  },
  gotoLogin: function(){
    if(!Tuti.loginview){
      Tuti.loginview = new Tuti.LoginView();
    }
    this.$("#content").html(Tuti.loginview.render().el);
    // this.renderShell('Login');
  },
  gotoHome: function(){
    this.renderShell('Home');
  },
  gotoAbout: function(){
    this.renderShell('About');
  }
});


// Login view
Tuti.LoginView = Backbone.View.extend({
  tagName: 'div',
  className: 'login-container',
  template: hdb.compile($('#app-login').html()),
  render: function(options){
    this.$el.html(this.template(options));
    return this;
  },
  events: {
    'click button': 'submit',
    'keypress input': 'onEnter'
  },
  onEnter: function(e){
    if(e.which === 13){
      this.submit(e);
    }
  },
  submit: function(e){
    e.preventDefault();
    var formData = {};
    this.$el.children( 'input' ).each( function( i, el ) {
      if( $( el ).val() !== '' ){
        formData[ el.name ] = $( el ).val();
      }
    });
    if(!formData.email || !formData.password){
      this.render({error: 'incomplete form'});
      return;
    }
    Backbone.ajax({
      dataType: "json",
      type: 'POST',
      url: "/api/login",
      data: formData,
      success: function(val){
        Tuti.store.set('token', val.success.token);
        Tuti.store.set('user.email', val.success.user.email);
        Tuti.store.set('user.id', val.success.user.id);
        Tuti.vent.trigger('goto:home');
      },
      error: function(response, texterror, content){
        if(response.status == 401){
          Tuti.loginview.render({error: 'Invalid email or password'});
        }
        else {
          Tuti.loginview.render({error: 'Something went wrong, try again'});
        }
      }
    });
  }
});


// Routes
Tuti.AppRouter = Backbone.Router.extend({
  routes: {
    "home":   "home",    
    "login": "login",
    "about": "about",
    "logout": "logout"
  },

  home: function() {
    Tuti.vent.trigger('goto:home');
  },
  login: function() {
    Tuti.vent.trigger('goto:login');
  },
  about: function() {
    Tuti.vent.trigger('goto:about');
  },
  logout: function(){
    Tuti.store.reset();
    Tuti.vent.trigger('goto:home');
  }
});


Tuti.App = new Tuti.AppShell();
Tuti.Router = new Tuti.AppRouter();

Backbone.history.start({pushState: true});


// Globally capture clicks. If they are internal and not in the pass
// through list, route them through Backbone's navigate method.
$(document).on("click", "a[href^='/']", function(event){
  href = $(event.currentTarget).attr('href');

  // chain 'or's for other black list routes
  // passThrough = href.indexOf('sign_out') >= 0;

  //  Allow shift+click for new tabs, etc.
  if(!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey){
    event.preventDefault();
    // Remove leading slashes and hash bangs (backward compatablility)
    url = href.replace(/^\//,'').replace('\#\!\/','');

    // Instruct Backbone to trigger routing events
    Tuti.Router.navigate(url, { trigger: true });  
  }
});
