// app.js
// author: Tsukasa Obara
// url   : http://saucer.jp



$(function(){
  HexSighter.run( 2 );
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
    self.setPrecision( 250 );
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

    var $indicator = $('<li/>').addClass( 'hexSighter' + id );
    $indicator.text( id + ':' );

    var hexSVG = self.createHexSVG(5);
    $indicator.append( hexSVG );

    var $precisions = $('<ul/>').addClass('precisions');
    $precisions.append('<li/><li/>');
    $indicator.append( $precisions );

    $parent.append( $indicator );
  };

  // setPrecision
  this.setPrecision = function( interval ){
    var id = statuses.id;
    var $precisions = $('.hexSighter' + id ).find('.precisions li');
    var iterator = setInterval( precision, interval );

    function precision(){
      $precisions.each(function(){
        $(this).text( self.getPrecision() );
      });
    }
  };

  // createHex
  proto.createHexSVG = function( size ){
    var url = 'http://www.w3.org/2000/svg';

    // hexs
    var hexs = document.createElementNS( url, 'svg');
    hexs.setAttribute('class','hexs');

    // filter
    var defs = document.createElementNS( url, 'defs');
    var filter = document.createElementNS( url, 'filter');
    filter.setAttribute('id','filter');

    var feGB = document.createElementNS( url, 'feGaussianBlur');
    feGB.setAttribute('in','SourceAlpha');
    feGB.setAttribute('stdDeviation','2');
    feGB.setAttribute('result','blur');

    var feM = document.createElementNS( url, 'feMerge');
    var feMN1 = document.createElementNS( url, 'feMergeNode');
    var feMN2 = document.createElementNS( url, 'feMergeNode');
    feMN1.setAttribute('in','blur');
    feMN2.setAttribute('in','SourceGraphic');
    feM.appendChild( feMN1 );
    feM.appendChild( feMN2 );

    filter.appendChild( feGB );
    filter.appendChild( feM );
    defs.appendChild( filter );
    hexs.appendChild( defs );
    
    // hex
    var size = size || 1;
    for( var i = 1; i <= size; i++ ){
      hexs.appendChild( cloneHex() );
    }

    function cloneHex(){
      var hex = document.createElementNS( url, 'polygon');

      var translate = (function(){
        var result = '';
        var val = 10 * Math.random();
        result = 'translate(' + val + ',' + val + ')';
        return result;
      })();

      var scale = (function(){
        var result = '';
        var val = Math.random();
        result = 'scale(' + val + ',' + val + ')';
        return result;
      })();

      hex.setAttribute('class','hex');
      hex.setAttribute('transform',translate + ',' + scale);
      hex.setAttribute('filter','url(#filter)');
      hex.setAttribute('fill','rgba(0,0,0,0.05)');
      hex.setAttribute('stroke','rgba(0,0,0,0.05)');
      hex.setAttribute('stroke-width','2');
      hex.setAttribute('points','20,70 0,35 20,0 59.9,0 79.8,35 59.9,70');
      return hex;
    }

    return hexs;
  };
}
