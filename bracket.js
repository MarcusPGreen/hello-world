(function(bracket, entrants, victories){
    var $bracketspace = $('#' + bracket);
    var width = $bracketspace.width();
    var height = $bracketspace.height();
    var spacepadding = 2;
    var colwidth = width / 12 - spacepadding;
    var rowheight = height / 32 - spacepadding;
    var timedelay = 200;

    function nextEntrant(i){
        processEntrant(entrants[i],i);

        if(i < entrants.length - 1){
            setTimeout(nextEntrant,timedelay,i + 1);
        }
        else{
            nextVictory(0);
        }
    }

    function processEntrant(entrant,i){
        var coli = i < 32 ? 0 : 11;
        var rowi = i < 32 ? i + 1 : i - 31;
        $div = $("<div>",{class: 'entrant', id:entrant[1],
                 width: colwidth, height: rowheight, col:coli, row:rowi});
        $div.html(entrant[0]);
        var fontscale = scaleFont($div.text().length,colwidth,rowheight);

        $div.css('font-size', fontscale + 'px');
        $div.css('top',rowi * (rowheight + spacepadding));
        $div.css('left',coli * (colwidth + spacepadding));
        $bracketspace.append($div);
    }

    function nextVictory(i){

        processVictory(victories[i])

        if(i < victories.length - 1){
            setTimeout(nextVictory,timedelay,i + 1);
        }
    }

    function processVictory(victor){
        var $victor = $('#' + victor);
        var step = 1;
        if($victor.attr("col") > 5){step = -step;}
        var newrow = Math.ceil(Number($victor.attr("row")) / 2);
        var newcol = Number($victor.attr("col")) + step;
        $victor.css('left',newcol * (colwidth + spacepadding));
        $victor.css('top',rowPos(newrow,newcol));
        $victor.attr('col',newcol);
        $victor.attr('row',newrow);
    }

    function scaleFont(textlength,boxwidth,boxheight){
        var rows = 1;
        var fontscale = boxheight / rows;
        var estwidth = fontscale * 1.5 * textlength;
        while(estwidth > boxwidth){
            rows++;
            var fontscale = boxheight / rows;
            var estwidth = fontscale * 1.5 * textlength / rows;
        }
        return fontscale;
    }

    function rowPos(row,col){
        if(col > 5){col = 11 - col;}
        var rowstep = Math.pow(2,col);
        var rowoff = (rowstep - 1) / 2;
        return (rowstep * row - rowoff) * (rowheight + spacepadding);
    }

    nextEntrant(0);
}("bracketspace",[["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Anita1"],
  ["AAAAAAAAAAAAAAAAAA","Anita16"],
  ["AAAAAAAAAAAAAAAAAAAAAAA","Anita8"],
  ["AAAAAAAAAAAAAAAAAA","Anita9"],
  ["AAAAAAAAAAAAAAAAAAAAAAA","Anita5"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Anita12"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Anita4"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAA","Anita13"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Anita6"],
  ["AAAAAAAAAAAAAAAAAA","Anita11"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAA","Anita3"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Anita14"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Anita7"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAA","Anita10"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Anita2"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAA","Anita15"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Jack1"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Jack16"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Jack8"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAA","Jack9"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Jack5"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAA","Jack12"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Jack4"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAA","Jack13"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Jack6"],
  ["AAAAAAAAAAAAAAAAAAAAAAA","Jack11"],
  ["AAAAAAAAAAAAAAAAAAAAAAAA","Jack3"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Jack14"],
  ["AAAAAAAAAAAAAAAAAAAAA","Jack7"],
  ["AAAAAAAAAAAAAAA","Jack10"],
  ["AAAAAAAAAAAAAAAA","Jack2"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Jack15"],
  ["AAAAAAAAAAAAAAAAAAA","Jason1"],
  ["AAAAAAAAAAAAAAAAAAAAAAAA","Jason16"],
  ["AAAAAAAAAAAAAAAAA","Jason8"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAA","Jason9"],
  ["AAAAAAAAAAAAAAAAAAAA","Jason5"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Jason12"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Jason4"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Jason13"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Jason6"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAA","Jason11"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Jason3"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Jason14"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Jason7"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Jason10"],
  ["AAAAAAAAAAAAAAAAAA","Jason2"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Jason15"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Marcus1"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Marcus16"],
  ["AAAAAAAAAAAAAAA","Marcus8"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Marcus9"],
  ["AAAAAAAAAAAAAAAAAAAAAA","Marcus5"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Marcus12"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Marcus4"],
  ["AAAAAAAAAAAAAAA","Marcus13"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Marcus6"],
  ["AAAAAAAAAAAAAAAAAAAAAAA","Marcus11"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Marcus3"],
  ["AAAAAAAAAAAAAAAAAAAAA","Marcus14"],
  ["AAAAAAAAAAAAAAAAAAAAAAA","Marcus7"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","Marcus10"],
  ["AAAAAAAAAAAAAAAAAAAA","Marcus2"],
  ["AAAAAAAAAAAAAAAAAAAAAAAAAAAA","Marcus15"]],
    ["Anita1",
    "Anita9",
    "Anita12",
    "Anita4",
    "Anita6",
    "Anita3",
    "Anita10",
    "Anita2",
    "Jack16",
    "Jack8",
    "Jack5",
    "Jack4",
    "Jack6",
    "Jack3",
    "Jack7",
    "Jack2",
    "Jason1",
    "Jason8",
    "Jason5",
    "Jason4",
    "Jason6",
    "Jason3",
    "Jason7",
    "Jason2",
    "Marcus1",
    "Marcus8",
    "Marcus5",
    "Marcus4",
    "Marcus6",
    "Marcus3",
    "Marcus7",
    "Marcus2",
    "Anita1",
    "Anita12",
    "Anita6",
    "Anita10",
    "Jack16",
    "Jack5",
    "Jack6",
    "Jack7",
    "Jason1",
    "Jason5",
    "Jason6",
    "Jason7",
    "Marcus1",
    "Marcus5",
    "Marcus6",
    "Marcus7",
    "Anita1",
    "Anita6",
    "Jack16",
    "Jack6",
    "Jason1",
    "Jason6",
    "Marcus1",
    "Marcus6",
    "Anita1",
    "Jack16",
    "Jason1",
    "Marcus1",
    "Anita1",
    "Jason1"]

 ));
