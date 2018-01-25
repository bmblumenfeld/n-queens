// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var slate = this.rows();
      if (slate[rowIndex].includes(1)) {
        return false;
      } else {
        return true; 
      } 
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var slate = this.rows();
      return slate.reduce(function (acc,element){
        var rowSum = element.reduce(function (sum,element){
          sum += element
          return sum
        },0)
        if (rowSum > 1) {
          acc = true;  
        }
        return acc;
      },false)
      
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var slate = this.rows();
      var colOcc = []
      slate.forEach(function (element){
        if (element[colIndex]) {
          colOcc.push(element[colIndex])  
        }  
      })
      if (colOcc.length > 1) {
        return true;  
      } else {
        return false;
      }
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var slate = this.rows();
      var n = slate.length-1
      var hasCon = false;
      for(var i = 0; i < slate.length; i++) {
        var check = this.hasColConflictAt(n)
        n--;
        if (check) {
          hasCon = true; 
          break; 
        }
      }
      return hasCon; 
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnindexAtFirstRow) {
      var slate = this.rows();
      var n = slate.length;
      var row;
      var col;
      var timesToRun;
      var conflictColl = [];
      if (majorDiagonalColumnindexAtFirstRow <= 0) {
        row = -(majorDiagonalColumnindexAtFirstRow);
        col = 0;
        timesToRun = n - row
        
        for(var i = 0; i < timesToRun; i++) {
          if (slate[row][col]) {
            conflictColl.push(1);
          }
          row++
          col++  
        }

      } else if (majorDiagonalColumnindexAtFirstRow > 0) {
        col = majorDiagonalColumnindexAtFirstRow;
        row = 0; 
        timesToRun = n - col;
        
        for(var i = 0; i < timesToRun; i++) {
          if(slate[row][col]) {
            conflictColl.push(1)   
          }
          row++
          col++  
        } 
      }

      if (conflictColl.length > 1) {
        return true;  
      } else {
        return false;  
      }
      
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var slate = this.rows();
      var isCon = false;
      for(var r = 0; r < slate.length; r++) {
        for(var c = 0; c <slate.length; c++) {
          if(this.hasMajorDiagonalConflictAt(c-r)) {
            isCon = true;
            break;  
          }  
        }  
      }
      return isCon;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnindexAtFirstRow) {
      var slate = this.rows();
      var n = slate.length;
      var row;
      var col;
      var timesToRun;
      var conflictColl = [];
      if (minorDiagonalColumnindexAtFirstRow <= 0) {
        row = 0;
        col = -(minorDiagonalColumnindexAtFirstRow);
        timesToRun = n - row
        
        for(var i = 0; i < timesToRun; i++) {
          if (slate[row][col]) {
            conflictColl.push(1);
          }
          row++
          col--  
        }

      } else if (minorDiagonalColumnindexAtFirstRow > 0) {
        col = 0;
        row = (minorDiagonalColumnindexAtFirstRow); 
        timesToRun = n - col;
        
        for(var i = 0; i < timesToRun; i++) {
          if(slate[row][col]) {
            conflictColl.push(1)   
          }
          row++
          col--  
        } 
      }

      if (conflictColl.length > 1) {
        return true;  
      } else {
        return false;  
      }
     
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
     var slate = this.rows();
      var isCon = false;
      for(var r = 0; r < slate.length; r++) {
        for(var c = 0; c <slate.length; c++) {
          if(this.hasMinorDiagonalConflictAt(r-c)) {
            isCon = true;
            break;  
          }  
        }  
      }
      return isCon;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
