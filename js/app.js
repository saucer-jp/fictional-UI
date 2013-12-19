// app.js
// author: Tsukasa Obara
// url   : http://saucer.jp



$(function(){
  HexSighter.run( 32 );
  logger.run( 80, 200 );
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
    $('#container').prepend( $el );
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
    '==> Upgrading postgresql',
    '==> Downloading http://ftp.postgresql.org/pub/source/v9.1.2/postgresql-9.1.2.tar.bz2',
    '######################################################################## 100.0%',
    '==> ./configure --disable-debug --prefix=/usr/local/Cellar/postgresql/9.1.2 --enable-thread-safety --with-bonjour --with-gssapi --',
    '==> make install-world',
    '==> Caveats',
    '# Build Notes',
    'If builds of PostgreSQL 9 are failing and you have version 8.x installed,',
    'you may need to remove the previous version first. See:',
    '  https://github.com/mxcl/homebrew/issues/issue/2510',
    'To build plpython against a specific Python, set PYTHON prior to brewing:',
    '  PYTHON=/usr/local/bin/python  brew install postgresql',
    'See:',
    '  http://www.postgresql.org/docs/9.1/static/install-procedure.html',
    '# Create/Upgrade a Database',
    'If this is your first install, create a database with:',
    '  initdb /usr/local/var/postgres',
    'To migrate existing data from a previous major version (pre-9.1) of PostgreSQL, see:',
    '  http://www.postgresql.org/docs/9.1/static/upgrading.html',
    '# Start/Stop PostgreSQL',
    'If this is your first install, automatically load on login with:',
    '  mkdir -p ~/Library/LaunchAgents',
    '  cp /usr/local/Cellar/postgresql/9.1.2/homebrew.mxcl.postgresql.plist ~/Library/LaunchAgents/',
    '  launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist',
    'If this is an upgrade and you already have the homebrew.mxcl.postgresql.plist loaded:',
    '  launchctl unload -w ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist',
    '  cp /usr/local/Cellar/postgresql/9.1.2/homebrew.mxcl.postgresql.plist ~/Library/LaunchAgents/',
    '  launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist',
    'Or start manually with:',
    '  pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start',
    'And stop with:',
    '  pg_ctl -D /usr/local/var/postgres stop -s -m fast',
    '# Loading Extensions',
    'By default, Homebrew builds all available Contrib extensions.  To see a list of all',
    'available extensions, from the psql command line, run:',
    '  SELECT * FROM pg_available_extensions;',
    'To load any of the extension names, navigate to the desired database and run:',
    '  CREATE EXTENSION [extension name];',
    'For instance, to load the tablefunc extension in the current database, run:',
    '  CREATE EXTENSION tablefunc;',
    'For more information on the CREATE EXTENSION command, see:',
    '  http://www.postgresql.org/docs/9.1/static/sql-createextension.html',
    'For more information on extensions, see:',
    '  http://www.postgresql.org/docs/9.1/static/contrib.html',
    '# Other',
    'Some machines may require provisioning of shared memory:',
    '  http://www.postgresql.org/docs/current/static/kernel-resources.html#SYSVIPC',
    'To install postgresql ( and ossp-uuid ) in 32 bits mode; you may use --32-bit :',
    '   brew install postgresql --32-bit',
    'If you want to install the postgres gem, including ARCHFLAGS is recommended:',
    '    env ARCHFLAGS="-arch x86_64" gem install pg',
    'To install gems without sudo, see the Homebrew wiki.',
    '==> Summary',
    '/usr/local/Cellar/postgresql/9.1.2: 2742 files, 37M, built in 4.0 minutes'
  ],

  // getLog
  getLog: function( logCount ){
    var self = this;
    var logStr = self.logs[ logCount ];
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

    var logs = self.logs;
    var logLength = logs.length;
    var logCount = 0;
    var $logs = $('#log');

    var iterator = setInterval( logger, interval);
    var logStr = '';

    function logger(){
      logStr = self.getLog( logCount );
      self.printLog( $logs, logStr );
      count++;

      if( logCount > logLength ){
        logCount = 0;
      } else {
        logCount++;
      }

      if( count > stopCount ){
        clearInterval( iterator );
      }
    }
  },

  // --------------------
  // view
  // --------------------
  // printLog
  printLog: function( $logs, logStr ){

    var $log = $('<li/>');
    $log.text( logStr );

    var listLength = $logs.find('li').length;
    if( listLength > 20 ){
      $logs.find('li:first').remove();
    }
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
      hex.setAttribute('points','20,70 0,35 20,0 59.9,0 79.8,35 59.9,70');
      return hex;
    }

    return hexs;
  };
}
