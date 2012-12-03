// app.js
// author: Tsukasa Obara
// url   : http://saucer.jp



$(function(){
  HexSighter.run( 10 );
  logger.run( 500, 20 );
});



// ********************
// HexSighter
// ********************
var HexSighter = {
  // --------------------
  // controller
  // --------------------
  // run
  run: function( sightSize ){
    var self = this;
    var ID = 'hexSighters';
    var $el = $('<ul/>', {id:ID});

    self.render( $el );

    var indicators = [];
    for( var i = 0; i < sightSize; i++ ){
      indicators[i] = new Indicator( $el, i ).run();
    }
  },

  // --------------------
  // view
  // --------------------
  // render
  render: function( $el ){
    $('body').prepend( $el );
  }
};



// ********************
// logger
// ********************
var logger = {
  // --------------------
  // model
  // --------------------
  // logs
  logs: [
    'log'
  ],

  // getLog
  getLog: function(){
    var logStr = '';
    logStr = this.logs[0];
    return logStr;
  },

  // --------------------
  // controller
  // --------------------
  // run
  run: function( interval, stopCount ){
    var self = this;
    var count = 0;
    var stopCount = stopCount;

    var iterator = setInterval( logger, interval);
    function logger(){
      self.printLog( self );
      count++;
      if( count > stopCount ){
        clearInterval( iterator );
      }
    }
  },

  // --------------------
  // view
  // --------------------
  // printLog
  printLog: function( self ){
    var $logs = $('#log');
    var logStr = self.getLog();
    var $log = $('<li/>');
    $log.text( logStr );
    $logs.append( $log );
  }
};



// ********************
// Indicator
// ********************
function Indicator( $parent, id ){

  var self = this;
  var $parent = $parent;
  var proto = Indicator.prototype;

  // --------------------
  // model
  // --------------------
  // statuses
  var statuses = {
    id: null
  };
  statuses.id = id;

  // data
  var data = {};

  // getPrecision
  proto.getPrecision = function(){
    var precision = 0;
    precision = Math.random();
    return precision;
  };

  // --------------------
  // controller
  // --------------------
  // run
  this.run = function(){
    self.render();
    self.event();
    //self.setPrecision( 500 );
  };

  // event
  this.event = function(){
    var id = statuses.id;
    var $el = $('.li' + id);
    $el.on('click', function(){
    });
  };

  // --------------------
  // view
  // --------------------
  // render
  this.render = function(){
    var id = statuses.id;

    var $indicator = $('<li/>').addClass( 'li' + id );
    $indicator.text( id + ':' );

    var $precisions = $('<ul/>').addClass('precisions');
    $precisions.append('<li/><li/>');
    $indicator.append( $precisions );

    $parent.append( $indicator );
  };

  // setPrecision
  this.setPrecision = function( interval ){
    var id = statuses.id;
    var $precisions = $('.li' + id ).find('.precisions li');
    var iterator = setInterval( precision, interval );

    function precision(){
      $precisions.each(function(){
        $(this).text( self.getPrecision() );
      });
    }
  };
}
