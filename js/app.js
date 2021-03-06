// app.js
// author: Tsukasa Obara
// url   : http://saucer.jp



$(function(){
  HexSighter.run( 32 );

  setTimeout( (function(){
    logger.run( 100, null );
  }), 3000 )
});



// ********************
// HexSighter
// ********************
var HexSighter = {
  // --------------------
  // controller
  // --------------------
  run: function( sightSize ){
    var self = this;
    var $el = $('.hexSighters');
    var $svg = $('.hexSighter');

    var indicators = [];
    for( var i = 0; i < sightSize; i++ ){
      indicators[i] = new Indicator( $el, i, $svg ).run();
      if( i === sightSize - 1 ){
        $svg.remove();
      }
    }
  },
};



// ********************
// logger
// ********************
var logger = {
  // --------------------
  // model
  // --------------------
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
    '&nbsp;',
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

  getLog: function( logCount ){
    var self = this;
    var logStr = self.logs[ logCount ];
    return logStr;
  },

  // --------------------
  // controller
  // --------------------
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

      if( stopCount === null ){
        logCount++;
        return;
      }else if( count > stopCount ){
        clearInterval( iterator );
      }
    }
  },

  // --------------------
  // view
  // --------------------
  printLog: function( $logs, logStr ){

    var $log = $('<li/>');
    $log.html( logStr );

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
function Indicator( $el, id, $svg ){

  var self = this;
  var $parent = $el;
  var proto = Indicator.prototype;
  var $svg = $svg;

  // --------------------
  // model
  // --------------------
  var statuses = {
    id: null
  };
  statuses.id = id;

  var data = {};

  proto.getPrecision = function(){
    var precision = 0;
    var num = 3 + Math.floor( Math.random() * 3 );
    precision = Math.random().toFixed( num );
    return precision;
  };

  // --------------------
  // controller
  // --------------------
  this.run = function(){
    self.render();
    self.event();

    var interval = 800 + Math.floor( Math.random() * 1500 );
    self.setPrecision( interval );
  };

  this.event = function(){
    var id = statuses.id;
    setTimeout( self.setMoveHex, 5000 );
  };

  // --------------------
  // view
  // --------------------
  this.render = function(){
    var id = statuses.id;

    $el.append( $svg.clone().addClass( 'hexSighter' + id ) );
  };

  this.setMoveHex = function(){
    var id = statuses.id;
    var $hexs = $('.hexSighter' + id ).find('.svg_hex');
    var interval = 200 + Math.floor( Math.random() * 1000 );
    var iterator = setInterval( move, interval );

    function getTranslate( start, end, limit, lastTranslate ){
      var x = start + Math.floor( Math.random() * end );
      var y = start + Math.floor( Math.random() * end );
      if( x < limit ){
        var translate = [
          'translate(',
          x + ',',
          y,
          '),'
        ].join('');
        return translate;
      } else {
        return lastTranslate;
      }
    }

    function move(){
      $hexs.each(function(){
        var $this = $(this)[0];
        var scale = $this.getAttribute('transform').match(/scale(.*)/)[0]; // scale(0.9)
        var lastTranslate = $this.getAttribute('transform').match(/translate(.*),/)[0];
        var translate = getTranslate( -8, 32, 8, lastTranslate );
        var val = translate + scale;
        $this.setAttribute('transform', val);
      });
    }
  };

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
}
